require([
    "aps/xhr",
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (xhr, at, load) {

    // getting MyWeatherDemo user linked to selected service user (it's available in aps.context.params for this view)
    xhr.get("/aps/2/resources?implementing(http://myweatherdemo.com/suwizard/user/1.0),like(username," + aps.context.params.user.login + ")").then(
        function(users) {

        // since email address is unique in OSA we can be sure that returned array will have only one object
        var user = users[0];

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
});