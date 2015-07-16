<?php
    
    define('APS_DEVELOPMENT_MODE', true);
    require "aps/2/runtime.php";
    require_once("utils.php");


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
         * @title("Units")
         */
        public $units;

        /**
         * @type(boolean)
         * @title("Show Humidity")
         */
        public $include_humidity;

        const BASE_URL = "http://www.myweatherdemo.com/api/user/";

        public function provision(){

            $request = array(
                'country' => $this->country,
                'city' => $this->city,
                'username' => $this->username,
                'password' => $this->password,
                'companyid' => $this->subscription_service->company_id,
                'units' => $this->units,
                'includeHumidity' => $this->include_humidity,
            );

            $response = send_curl_request(false, $this->subscription_service->company_token, 'POST', self::BASE_URL, $request);

            $this->user_id = $response->{'id'};
        }

        public function configure($new){

            $url = self::BASE_URL . $this->user_id;

            $request = array(
                'companyid' => $this->subscription_service->company_id,
                'country' => $new->country,
                'city' => $new->city,
                'username' => $new->username,
                'password' => $new->password,
                'units' => $new->units,
                'includeHumidity' => $new->include_humidity
            );

            $response = send_curl_request(false, $this->subscription_service->company_token, 'PUT', $url, $request);
        }

        public function unprovision(){

            $url = self::BASE_URL . $this->user_id;
            $response = send_curl_request(false, $this->subscription_service->company_token, 'DELETE', $url);

        }
    }
?>