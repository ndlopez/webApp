<?php
require_once PROJECT_ROOT_PATH . "/model/database.php";

/* Sth not mentioned on tutorial: 
the parameters of select function are:
i: integer data, d: double, s: string, b: blob
more @ https://www.php.net/manual/en/mysqli-stmt.bind-param.php
*/
class DataModel extends Database{

    public function getData($limit){
        /* Get all data in DB but limitted by value */
        $dbTable = 'weather_data';
        return $this->select("SELECT * FROM $dbTable ORDER BY hour ASC LIMIT ?",["i",$limit]);
    }

    public function get_by_date($thisDate){
        /* Get data by unique date value */
        $dbTable = 'weather_data';
        if (! get_magic_quotes_gpc()){
            $thisDate = addslashes($thisDate);
        }
        return $this->select("SELECT * FROM $dbTable WHERE date = ?",["s",$thisDate]);
    }

    public function get_between_dates($thisDate,$thatDate){
        /* Get data between two dates obviously one higher then other */
        $dbTable = 'weather_data';
        if (! get_magic_quotes_gpc()){
            $thisDate = addcslashes($thisDate);
            $thatDate = addcslashes($thatDate);
        }

        // $thatQuery = "SELECT * FROM $dbTable WHERE date BETWEEN ? AND ?";

        return $this->select("SELECT * FROM $dbTable WHERE date BETWEEN ? AND ?",[["s",$thisDate],["s",$thatDate]]);
    }
}