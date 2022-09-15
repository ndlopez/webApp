<!DOCTYPE html>
<html>
    <head>
        <title>Update DB</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="estilo.css">
    </head>
    <body>

<?php
date_default_timezone_set("Asia/Tokyo");
$heute = date("md");
$dbTable = "weather_data";
$data_dir = "../data/";
$data_file = "tenki_hour_" . $heute . ".csv";
printf("Reading: ".$data_dir.$data_file);
$auxQuery = "";
$auxStr = "";
$upQuery = "INSERT INTO " . $dbTable . " VALUES(";

$fileHandle = fopen($data_dir.$data_file,"r");
while(($row = fgetcsv($fileHandle,0,",")) !== FALSE){
    if (count($row) == 1 && empty($row[0])){
        continue;
    }
    //var_dump($row);
    if($row[0] !== "date"){
        //echo $upQuery;
        $auxQuery = $upQuery;
        for ($idx=0; $idx <9 ; $idx++) {
            if($row[$idx] == "---"){
                $row[$idx] = "0";
            }

            if($idx == 8){
                //windDir
                $auxStr = "'".$row[$idx]."'";
                //echo $col[$idx];
            }elseif($idx == 0 || $idx == 2){
                $auxStr = "'".$row[$idx]."',";
            }else{
                $auxStr = $row[$idx] . ",";
                //echo $col[$idx].",";
            }
            $auxQuery.= $auxStr;
        }
        //echo ")<br/>";
        $auxQuery.= ")";
        echo "<p>".$auxQuery."  ";
        //$returnVal = mysqli_query($dbHandle,$auxQuery);
        //if(!$returnVal){die(" couldnt upload db".mysqli_error($dbHandle));}
        //else{echo "done</p>";}
    }
}

?>
</body>
</html>