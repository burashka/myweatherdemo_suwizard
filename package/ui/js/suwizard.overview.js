require([
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (at, load) {

    // aps.context.params contains 'objects' that we passed from suwizard.new 
    var user = aps.context.params.objects[0];

    var widgets =
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                id: "description",
                value: "Here you can overview user settings."
            }],
            ["aps/FieldSet", {title: true}, [
                ["aps/Output", {id: "username", label: "Username", value: at(user, "username")}],
                ["aps/Password", {id: "password", label: "Password", value: at(user, "password")}],
                ["aps/Output", {id: "city", label: "City", value: at(user, "city")}],
                ["aps/Output", {id: "country", label: "Country", value: at(user, "country")}],
                ["aps/Output", {id: "units", label: "Units of Measurement", value: at(user, "units")}],
                ["aps/CheckBox", {id: "show_humidity", label: "Do you want to see humidity?", checked: at(user, "include_humidity"), disabled: true}]
            ]]
        ]];
    load(widgets);
});