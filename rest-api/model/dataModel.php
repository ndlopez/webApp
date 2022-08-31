<?php
require_once PROJECT_ROOT_PATH . "/model/database.php";

/* Sth not mentioned on tutorial: 
the parameters of select function are:
i: integer data, d: double, s: string, b: blob
more @ https://www.php.net/manual/en/mysqli-stmt.bind-param.php
*/
class DataModel extends Database{

    public function getData($limit){
        $dbTable = 'weather_data';
        return $this->select("SELECT * FROM $dbTable ORDER BY hour ASC LIMIT ?",["i",$limit]);
    }

    public function get_by_date($thisDate){
        $dbTable = 'weather_data';
        if (! get_magic_quotes_gpc()){
            $thisDate = addslashes($thisDate);
        }
        return $this->select("SELECT * FROM $dbTable WHERE date = ?",["s",$thisDate]);
    }
}