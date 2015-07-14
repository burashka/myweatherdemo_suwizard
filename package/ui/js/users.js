require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "aps/load",
    "dojox/mvc/at",
    "aps/Message",
    "./js/getUnassignedServiceUsers.js",
    "aps/ready!"
], function (ResourceStore, registry, when, load, at, Message, getUnassignedServiceUsers) {

    // creating a connector to APS controller
    // by specifying apsType we will get only resources of this type from APS controller
    var store = new ResourceStore({
        apsType: "http://myweatherdemo.com/suwizard/user/1.0",
        target: "/aps/2/resources/"
    });

    var company = aps.context.vars.subscription_service;

    var widgets = (
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                content: "Here you can create subscriptions to track weather in other cities as well. <br><br>After you subscribe to weather in other cities go to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> to login using username <b>${username}</b> and password <b>${password}</b>.<br><br>To see current weather for your cities click on 'Weather Information' tab once logged in.",
                username: at(company, "username"),
                password: at(company, "password")
            }],
            ["aps/Grid",
                {
                    id: "grid",
                    // user can select several rows
                    selectionMode: "multiple",
                    // when this aps/Grid is loaded store.query() will be automatically executed fetching list of all the cities from APS controller
                    store: store,
                    // when a row is clicked the user will be navigated to 'city.edit' view passing the aps.id of selected resource
                    apsResourceViewId: "user.edit",
                    columns: [
                        // resourceName attribute on a column specifies which column value should be displayed as a link
                        { field: "username", name: "Username",type: "resourceName"},
                        { field: "country", name: "Country" },
                        { field: "city", name: "City" },
                        { field: "units", name: "Units of measurement" },
                        { field: "include_humidity", name: "showHumidity" }
                    ]
                },
                [["aps/Toolbar", [
                    ["aps/ToolbarButton", {
                        // button will not be disabled after click
                        autoBusy: false,
                        // using predefined button icon
                        iconClass: "sb-add-new",
                        label: "Add",
                        onClick: function() {
                            when(getUnassignedServiceUsers(), function(users) {
                                if (!users.users.length) {
                                    var messages = registry.byId("top_container").get("messageList");
                                    messages.addChild(new Message({description: "there are no service users available", type: "error"}));
                                    return;
                                }
                                aps.apsc.gotoView("user.add");
                            });
                        }
                    }],
                    ["aps/ToolbarButton", {
                        autoBusy: false,
                        requireItems: true,
                        iconClass: "sb-delete",
                        label: "Delete",
                        onClick: function() {
                            // getting access to user selection in aps/Grid
                            var grid = registry.byId("grid");
                            var sel = grid.get("selectionArray");
                            for (var i=0; i<sel.length; i++){
                                // deleting each selected city
                                when(store.remove(sel[i]), function() {
                                    // if city was successfully removed from MyWeatherDemo: removing selection from selectionArray
                                    sel.splice(sel.indexOf(i),1);
                                    // refreshing data in a grid to not show cities which were already removed from the store
                                    grid.refresh();
                                });
                            };
                        }
                    }]
                ]]]
            ]
        ]]);
    load(widgets);
});