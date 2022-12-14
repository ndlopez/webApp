<?php
class BaseController{
    /* call method */
    public function __call($name,$arguments){
        $this->sendOutput('',array('HTTP/1.1 404 not found'));
    }
    /* get URI elems */
    protected function getUriSegments(){
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/',$uri);

        return $uri;
    }
    /* get queryStr params */
    protected function getQueryStringParams(){
        //var_dump($_SERVER['QUERY_STRING']." parsed:".parse_str($_SERVER['QUERY_STRING'],$query));
        parse_str($_SERVER['QUERY_STRING'],$query);
        return $query;
    }
    /*send api out */
    protected function sendOutput($data,$httpHeaders=array()){
        header_remove('Set-Cookie');

        if (is_array($httpHeaders) && count($httpHeaders)){
            foreach ($httpHeaders as $httpHeader){
                header($httpHeader);
            }
        }
        echo $data;
        exit;
    }
}