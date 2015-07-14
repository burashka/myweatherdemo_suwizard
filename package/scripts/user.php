<?php
    require "aps/2/runtime.php";    

    /**
    * @type("http://myweatherdemo.com/suwizard/user/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */

    class app extends \APS\ResourceBase
    
    {
        /**
         * @link("http://myweatherdemo.com/suwizard/subscription_service/1.0")
         * @required
         */
        public $subscription_service;

        /**
         * @link("http://aps-standard.org/types/core/service-user/1.0")
         * @required
         */
        public $service_user;

        /**
         * @type(string)
         * @title("User Id in MyweatherDemo")
         */
        public $user_id;
        
        /**
         * @type(string)
         * @title("City")
         */
        public $city;

        /**
         * @type(string)
         * @title("Country")
         */
        public $country;

        /**
         * @type(string)
         * @title("Login to MyWeatherDemo interface")
         */
        public $username;

        /**
         * @type(string)
         * @title("Password for MyWeatherDemo user")
         */
        public $password;

         /**
         * @type(string)
         * @title("First Name and Last Name")
         */
        public $name;

        /**
         * @type(string)
         * @title("Units")
         */
        public $units;

        /**
         * @type(boolean)
         * @title("Show Humidity")
         */
        public $include_humidity;
    }
?>