define(["aps/ResourceStore", "dojo/Deferred", "dojo/promise/all"],
	function (ResourceStore, Deferred, all) {
		var getUnassignedServiceUsers = function () {
 
			var serviceUsersStore = new ResourceStore({
				target: "/aps/2/resources/",
				apsType: "http://aps-standard.org/types/core/service-user/1.0"
			});
 
			var mwdUsersStore = new ResourceStore({
				apsType: "http://myweatherdemo.com/suwizard/user/1.0",
				target: "/aps/2/resources/"
			});
 
			var deferred = new Deferred();
 
			all({users: serviceUsersStore.query(), mwd_users: mwdUsersStore.query()}).then(function(results) {

				var userList = [];

				for (var j = 0; j < results.users.length; j++) {
					var user = results.users[j];
					// finding service users that already have MyWeatherDemo assigned
					var match = results.mwd_users.filter(function(mwd_user) {
						return mwd_user.username == user.login;
					});

					// adding to userList only those users that do not have MyWeatherDemo assigned
					match.length ? console.log("this user already has mwd assigned") : userList.push({ id: user.aps.id, label: user.login, value: user.aps.id });
				}
				deferred.resolve({users:userList});
			});
			return (deferred);
		};
	return getUnassignedServiceUsers;
});