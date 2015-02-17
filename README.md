# Web service for Less

Install the depencendies with `nmp install -g less`.
Then start the `serve.js` script to run a server on port 7070 (edit the code to change port).

## Quick Start
```bash
sudo touch /etc/init.d/SERVICE_NAME
sudo chmod a+x /etc/init.d/SERVICE_NAME
sudo update-rc.d SERVICE_NAME defaults
```

## Use :
```bash
sudo service SERVICE_NAME start
sudo service SERVICE_NAME stop
```

## Documentation : 
Less compression can be used as an HTTP service by sending a POST request to this URL, with any of the parameters listed below either embedded in the URL, or in an application/x-www-form-urlencoded request body. The response body will contain the compressed code in case of a successful request, or an error message when returning an error HTTP status code.

less_code
Less code passed directly inside the request. Both this parameter and code_url can be given, in which case the code passed in less_code will end up after the code from URLs.

## About
inspired by http://marijnhaverbeke.nl/uglifyjs and [Marijn Haverbeke](https://github.com/marijnh/UglifyJS-service)

## Copyright
Copyright &copy; 2015 [Ralantonisainana Dany]
