require([
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (at, load) {

    var user = aps.context.params.objects[0];

    var widgets =
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                value: "Here you can create a user in MyWeatherDemo."
            }],
            ["aps/FieldSet", {title: true}, [
                ["aps/Output", {label: "Username", value: at(user, "username")}],
                ["aps/Output", {label: "Password", value: at(user, "password")}],
                ["aps/Output", {label: "City", value: at(user, "city")}],
                ["aps/Output", {label: "Country", value: at(user, "country")}],
                ["aps/Output", {label: "Units of Measurement", value: at(user, "units")}],
                ["aps/CheckBox", {label: "Do you want to see humidity?", checked: at(user, "include_humidity"), disabled: true}]
            ]]
        ]];
    load(widgets);
});