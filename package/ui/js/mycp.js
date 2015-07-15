require([
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (at, load) {

    // 'user' variable is defined in APP-META.xml for this view
    var user = aps.context.vars.user;

    var widgets =
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                content: "Congratulations! A user was created for you in MyWeatherDemo.<br><br>You can now go to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> to login using username <b>${username}</b> and password <b>${password}</b>.<br><br>To see current weather for your city click on 'Weather Information' tab once logged in.",
                username: at(user, "username"),
                password: at(user, "password")
            }],
            ["aps/FieldSet", {title: true}, [
                ["aps/Output", {label: "City", value: at(user, "city")}],
                ["aps/Output", {label: "Country", value: at(user, "country")}],
                ["aps/Output", {label: "Units of Measurement", value: at(user, "units")}],
                ["aps/CheckBox", {label: "Do you want to see humidity?", checked: at(user, "include_humidity"), disabled: true}]
            ]]
        ]];
    load(widgets);
});