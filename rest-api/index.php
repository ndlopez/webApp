<?php
ini_set('display_errors',1);

require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/',$uri);

if((isset($uri[3]) && $uri[3] != 'datos') || !isset($uri[4])){
    header("HTTP/1.1 404 not found :(");
    exit();
}

if((isset($uri[3]) && $uri[3] != 'limit') || !isset($uri[4])){
    header("HTTP/1.1 404 not found :(");
    exit();
}

require PROJECT_ROOT_PATH . "/control/dataControl.php";

$objFeedController =  new DataController();
$strMethodName = $uri[4] . 'Action';
/* $uri[3] = datos, $uri[4] = list 
var_dump("thisVar:".$uri[3].",".$uri[4]);*/
$objFeedController->{$strMethodName}();
?>