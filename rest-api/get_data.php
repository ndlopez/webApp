<?php
ini_set('display_errors',1);
?>
<!DOCTYPE html>
<html>
<head>
<title>webApp: query DB</title>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="../static/estilo.css">
</head>
<body>
    <div class="clearfix">
    <h2>Search for data into DB</h2>
        <form method="post">

            <label>Enter Date: (YYYY-MM-DD) </label>
            <input type="text" name="myDate" min="2022-07-29" max="2022-08-31" required> 
            <span class="validity"></span>
            <br/>
            <input type="submit" value="SELECT" name="Submit1"> <br/>

        </form>
    </div>
    <div class="clearfix">
    
<?php

require_once "inc/config.php";

if(isset($_POST['Submit1']))
{
//connection to the mysql database,
$dbhandle = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if($dbhandle === false){
    die("Error: Could not connect to DB".$dbhandle->connect_error);
}else{
    echo "<span>Connection established to: ".DB_HOST."</span>";
}

$dbTable = "weather_data";

$query = "SELECT * FROM weather_data WHERE date='".$_POST["myDate"] ."';";
//echo "\nyour query: ".$query;

$humanDate = date('l jS \of F Y',strtotime($_POST["myDate"]));
//str_getcsv($_POST["myDate"],"-"); split string by param="-"

echo "<h3>Weather report for ".$humanDate."</h3>";
echo "<h4>Get these data in <a href='/rest-api/index.php/datos/list?thisDate=".$_POST["myDate"]."'>JSON format </a></h4>";
?>
</div>
<div class="clearfix" style="padding:0px;">
<table id="myday">
    <tr>
        <th>時刻</th><th>天気</th>
        <th>気温<br>&#8451;</th>
        <th>降水量<br>%</th>
        <th>湿度<br>%</th>
        <th>風速<br>m/s</th>
        <th>風向</th>
    </tr>
<?php
if(!empty($_POST["myDate"]))
{
    if ($result = mysqli_query($dbhandle,$query)){
        foreach ($result as $row){
            //var_dump($row);
            echo "<tr><td>".$row['hour'].":00</td><td>".$row['weather']."</td><td>".$row['temp']."</td>";
            echo "<td>".$row['rainProb']."</td><td>".$row['humid'] ."</td>";
            echo "<td>".$row['wind']."</td><td>".$row['windDir']."</td></tr>";
        }
        echo "</table></div>";
    }
    else{
        echo "<p>Something went wrong</p>";
    }

//$result = mysqli_query($dbhandle, $query);
}

else{
    echo "Please input date";
    //$result = mysqli_query($dbhandle, "SELECT * FROM weather_data;" );
}
mysqli_close($dbhandle);
}

?>
<h4>Go back <a href="http://webapp.physics">Home</a></h4>
</body>

</form>