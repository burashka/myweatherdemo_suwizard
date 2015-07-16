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
                    id: "description",
                    value: "Here you can create a user in MyWeatherDemo."
                }],
                ["aps/FieldSet", {title: true}, [
                    ["aps/Output", {id: "username", label: "Username", value: at(user, "username")}],
                    ["aps/Output", {id: "password", label: "Password", value: at(user, "password")}],
                    ["aps/Output", {id: "city", label: "City", value: at(user, "city")}],
                    ["aps/Output", {id: "country", label: "Country", value: at(user, "country")}],
                    ["aps/Output", {id: "units", label: "Units of Measurement", value: at(user, "units")}],
                    ["aps/CheckBox", {id: "show_humidity",label: "Do you want to see humidity?", checked: at(user, "include_humidity"), disabled: true}]
                ]]
            ]];
        load(widgets);
    });
});