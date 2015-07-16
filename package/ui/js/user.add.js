require([
    "aps/ResourceStore",
    "aps/Memory",
    "dijit/registry",
    "dojox/mvc/at",
    "dojo/when",
    "aps/load",
    "dojo/text!./js/user.json",
    "./js/getUnassignedServiceUsers.js",
    "aps/ready!"
], function (ResourceStore, Memory, registry, at, when, load, newUser, getUnassignedServiceUsers) {

    // preparing connector to APS controller, we will work with 'users' collection on subscription_service
    var store = new ResourceStore({
        target: "/aps/2/resources/" + aps.context.vars.subscription_service.aps.id + "/users"
    });

    var user = JSON.parse(newUser);

    // getting list of service users that don't have MyWeatherDemo assigned yet
    when(getUnassignedServiceUsers(), function(service_users) {

        // we want the username have the 'login' value of associated service user
        user.username = service_users.users[0].login;
        // preselecting the first user in returned array
        user.service_user.aps.id = service_users.users[0].aps.id;

        // need to specify idProperty so that aps/Select puts later aps.id into user.service_user.aps.id
        var userMemory = new Memory({ data: service_users.users, idProperty: "aps.id" });

        var widgets =
            ["aps/PageContainer", {id: "top_container"}, [
                ["aps/Output", {
                    id: "description",
                    value: "Here you can create a user in MyWeatherDemo."
                }],
                ["aps/FieldSet", {title: true}, [
                    // need to specify labelAttr since we don't have property 'label' in service user objects
                    ["aps/Select", {id: "user", title: "User", labelAttr: "login", store: userMemory, value: at(user.service_user.aps, "id")}],
                    ["aps/Password", {id: "password", label: "Password", value: at(user, "password"), required: true, showStrengthIndicator: true}],
                    ["aps/TextBox", {id: "city",label: "City", value: at(user, "city"), required: true}],
                    ["aps/TextBox", {id: "country", label: "Country", value: at(user, "country"), required: true}],
                    ["aps/Select", {
                        id: "units",
                        title: "System of measurement",
                        value: at(user, "units"),
                        options: [
                            { label: "Fahrenheit", value: "fahrenheit"},
                            { label: "Celsius", value: "celsius", selected: true}
                        ]
                    }],
                    ["aps/CheckBox", {id: "show_humidity", label: "Do you want to see humidity?", checked: at(user, "include_humidity")}]
                ]]
            ]];
        load(widgets);
    });

    aps.app.onCancel = function() {
        aps.apsc.gotoView("users");
    };

    aps.app.onSubmit = function() {
        var page = registry.byId("top_container");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
        when(store.put(user), function() {
            aps.apsc.gotoView("users");
        });
    };
});

