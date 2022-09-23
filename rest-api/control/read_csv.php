<!DOCTYPE html>
<html>
    <head>
        <title>WebApp.Physics: Update DB </title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="../../static/stylez.css">
    </head>
    <body>
<?php

date_default_timezone_set("Asia/Tokyo");
if($_POST["monty"] == "Month" || $_POST["Day"]){
    echo "<p>Please select month and day</p>";
    exit;
}
$heute = $_POST["monty"].$_POST["tag"]; // date("md");
$data_dir = "../../data/";
$data_file = "tenki_hour_" . $heute . ".csv";

echo "<h2> Welcome: ".$_POST["my_id"]."</h2>";
echo "<h2>Updating DB...</h2>";
echo "<p>Reading: ".$data_dir.$data_file."</p>";

$heute = date ("Y-m-d");
$dbTable = "weather_data";
$existQry = "SELECT date FROM $dbTable WHERE EXISTS 
(SELECT date FROM $dbTable WHERE date=$heute)";

$auxQuery = "";
$auxStr = "";
$upQuery = "INSERT INTO " . $dbTable . " VALUES(";

if(file_exists($data_dir.$data_file)){
    require_once "../inc/config.php";
    $dbHandle = mysqli_connect(DB_HOST,DB_USER,$_POST["my_pass"],DB_NAME);
    if(mysqli_connect_errno()){
        die("Couldnt connect to DB,".mysqli_connect_error());
    }
    $fileHandle = fopen($data_dir.$data_file,"r");
    while(($row = fgetcsv($fileHandle,0,",")) !== FALSE){
        if (count($row) == 1 && empty($row[0])){
            continue;
        }
        //var_dump($row);
        if($row[0] !== "date"){
            $auxQuery = $upQuery;
            for ($idx=0; $idx <9 ; $idx++) {
                if($row[$idx] == "---"){
                    $row[$idx] = "0";
                }

                if($idx == 8){
                    //windDir
                    $auxStr = "'".$row[$idx]."'";
                }elseif($idx == 0 || $idx == 2){
                    $auxStr = "'".$row[$idx]."',";
                }else{
                    $auxStr = $row[$idx] . ",";
                }
                $auxQuery.= $auxStr;
            }
            $auxQuery.= ")";
            echo "<p>".$auxQuery."  ";
            $returnVal = mysqli_query($dbHandle,$auxQuery);
            if(!$returnVal){die(" couldnt upload db".mysqli_error($dbHandle));}
            else{echo "done</p>";}
        }
    }
}else{
    echo "<p>Couldnt find such file :(</p>";
}

fclose($fileHandle);
mysqli_close($dbHandle);

// Redirect to home
echo "<h2>Redirecting to <a href='http://webapp.physics'>home</a></h2>";
// sleep(15);
// ob_start();
// header('Location: //webapp.physics');
// ob_end_flush();
//exit();

// printf($existQry);
?>
</body>
</html>