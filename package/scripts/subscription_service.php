<?php

    require "aps/2/runtime.php";    

    /**
    * @type("http://myweatherdemo.com/suwizard/subscription_service/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    
    class company extends \APS\ResourceBase
    
    {

        /**
         * @link("http://myweatherdemo.com/suwizard/application/1.0")
         * @required
         */
        public $application;

        /**
         * @link("http://myweatherdemo.com/suwizard/user/1.0[]")
         */
        public $users;
        
        /**
         * @link("http://aps-standard.org/types/core/account/1.0")
         * @required
         */
        public $account;
        
        /**
         * @type(string)
         * @title("Company identifier in MyWeatherDemo")
         */
        public $company_id;

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

        // MyWeatherDemo API URL to work with companies
        const BASE_URL = "http://www.myweatherdemo.com/api/company/";
        
        // provision() method is executed when resource is created (POST)
        public function provision(){
            
            // to create a company in external service we need to pass country, city and name of the company
            // we can get them from linked core/account resource
            $request = array(
                    'country' => $this->account->addressPostal->countryName,
                    'city' => $this->account->addressPostal->locality,
                    'name' => $this->account->companyName
            );
            
            $response = $this->send_curl_request('POST', self::BASE_URL, $request);

            // need to save company_id in APSC, going to use that later to delete a resource in unprovision()
            // username and password will be used to login to MyWeatherDemo web interface
            $this->company_id = $response->{'id'};
            $this->username = $response->{'username'};
            $this->password = $response->{'password'};
        }

        // unprovision() method is executed when resource is removed (DELETE)
        public function unprovision(){

            // need to pass company_id to indicate which company we want to delete
            $url = self::BASE_URL . $this->company_id;
            $response = $this->send_curl_request('DELETE', $url);
        }

        // you can add your own methods as well, don't forget to make them private
        private function send_curl_request($verb, $url, $payload = ''){

            $token = $this->application->provider_token;

            $headers = array(
                    'Content-type: application/json',
                    'x-provider-token: '. $token
            );

            $ch = curl_init();
            
            curl_setopt_array($ch, array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CUSTOMREQUEST => $verb,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($payload)
            ));
            
            $response = json_decode(curl_exec($ch));
            
            curl_close($ch);

            return $response;
        }
    }
?>
