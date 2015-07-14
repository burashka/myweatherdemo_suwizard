require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/at",
    "dojox/mvc/getStateful",
    "aps/load",
    "aps/ready!"
], function (ResourceStore, registry, when, at, getStateful, load) {
    var store = new ResourceStore({
            target: "/aps/2/resources/"
        });

    var user = getStateful(aps.context.vars.user);

        var widgets =
            ["aps/PageContainer", {id: "top_container"}, [
                ["aps/Output", {
                    value: "Here you can create a user in MyWeatherDemo."
                }],
                ["aps/FieldSet", {title: true}, [
                    ["aps/Output", {label: "Username", value: at(user, "username")}],
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