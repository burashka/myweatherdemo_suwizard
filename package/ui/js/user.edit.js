require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (ResourceStore, registry, when, at, load) {

    // since we are just editing an existing resource we can work with root collection /aps/2/resouces
    var store = new ResourceStore({
            target: "/aps/2/resources/"
        });

    // we have 'user' variable defined in navigation in APP-META.xml
    var user = aps.context.vars.user;

        var widgets =
            ["aps/PageContainer", {id: "top_container"}, [
                ["aps/Output", {
                    id: "description",
                    value: "Here you can edit user information in MyWeatherDemo."
                }],
                ["aps/FieldSet", {title: true}, [
                    ["aps/Output", {id: "username", label: "Username", value: at(user, "username")}],
                    ["aps/Password", {id: "password", label: "Password", value: at(user, "password"), required: true, showStrengthIndicator: true}],
                    ["aps/TextBox", {id: "city", label: "City", value: at(user, "city"), required: true}],
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