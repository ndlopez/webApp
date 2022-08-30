<?php
require_once PROJECT_ROOT_PATH . "/model/database.php";

class DataModel extends Database{
    //protected $dbTable = ;

    public function getData($limit){
        $dbTable = 'weather_data';
        return $this->select("SELECT * FROM $dbTable ORDER BY hour ASC LIMIT ?",["i",$limit]);
    }

    public function get_by_date($thisDate){
        $dbTable = 'weather_data';
        return $this->select("SELECT * FROM $dbTable WHERE date=?",["s",$thisDate]);
    }
}