require([
    "dijit/registry",
    "dojox/mvc/at",
    "aps/load",
    "dojo/text!./js/user.json",
    "aps/ready!"
], function (registry, at, load, newUser) {

    var user = JSON.parse(newUser);

    // information about service user is available in aps.context.param
    user.username = aps.context.params.user.login;

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

    aps.app.onNext = function() {
        var page = registry.byId("top_container");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
        // we need to pass the model constructed from widgets + name of the link to service user defined in user.php as userAttr
        aps.apsc.next({ objects: [(user)], userAttr: "service_user" });
    };
});