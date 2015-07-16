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

    var store = new ResourceStore({
        apsType: "http://myweatherdemo.com/suwizard/user/1.0",
        target: "/aps/2/resources/"
    });

    // we have 'subscription_service' variable defined at the root of navigation tree in APP-META.xml
    var company = aps.context.vars.subscription_service;

    var widgets = (
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                content: "Here you can give access to MyWeatherDemo to your employees.<br><br>You can see a list of users associated with your account by logging in to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> using username <b>${username}</b> and password <b>${password}</b>.<br><br>PLACEHOLDER: WHERE TO SEE USERS.",
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
                        autoBusy: false,
                        iconClass: "sb-add-new",
                        label: "Add",
                        onClick: function() {
                            // if there are no service users available for linking we want to show an error message on this view
                            when(getUnassignedServiceUsers(), function(users) {
                                if (!users.users.length) {
                                    var messages = registry.byId("top_container").get("messageList");
                                    messages.addChild(new Message({description: "There are no service users available.", type: "error"}));
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