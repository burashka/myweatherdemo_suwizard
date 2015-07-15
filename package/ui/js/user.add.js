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

    var store = new ResourceStore({
        target: "/aps/2/resources/" + aps.context.vars.subscription_service.aps.id + "/users"
    });

    var user = JSON.parse(newUser);

    when(getUnassignedServiceUsers(), function(service_users) {

        console.log(service_users);

        user.username = service_users.users[0].login;
        user.service_user.aps.id = service_users.users[0].aps.id;

        var userMemory = new Memory({ data: service_users.users, idProperty: "aps.id" });

        var widgets =
            ["aps/PageContainer", {id: "top_container"}, [
                ["aps/Output", {
                    value: "Here you can create a user in MyWeatherDemo."
                }],
                ["aps/FieldSet", {title: true}, [
                    ["aps/Select", {title: "User", labelAttr: "login", store: userMemory, value: at(user.service_user.aps, "id")}],
                    ["aps/TextBox", {label: "Password", value: at(user, "password"), required: true}],
                    ["aps/TextBox", {label: "City", value: at(user, "city"), required: true}],
                    ["aps/TextBox", {label: "Country", value: at(user, "country"), required: true}],
                    ["aps/Select", {
                        title: "System of measurement",
                        value: at(user, "units"),
                        options: [
                            { label: "Fahrenheit", value: "fahrenheit"},
                            { label: "Celsius", value: "celsius", selected: true}
                        ]
                    }],
                    ["aps/CheckBox", {label: "Do you want to see humidity?", checked: at(user, "include_humidity")}]
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

