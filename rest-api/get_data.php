<?php
ini_set('display_errors',1);
?>
<!DOCTYPE html>
<html>
<head>
<title>PHP MySQL connection example</title>
<link rel="stylesheet" type="text/css" href="../static/estilo.css">
</head>
<body>
<div class="clearfix">
    <form method="post">

        Enter Date : <input type="text" name="myDate"> &emsp;

        <input type="submit" value="SELECT" name="Submit1"> <br/>

    </form>
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

require_once "inc/config.php";

if(isset($_POST['Submit1']))
{ 

//connection to the mysql database,

$dbhandle = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if($dbhandle === false){
    die("Error: Could not connect to DB".$dbhandle->connect_error);
}else{
    echo "Connection established to: ".DB_HOST;
}

$dbTable = "weather_data";

$query = "SELECT * FROM weather_data WHERE date='".$_POST["myDate"] ."';";
echo "\nyour query: ".$query;
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

else

{ 
echo "Please input date";
//$result = mysqli_query($dbhandle, "SELECT * FROM weather_data;" );

}
//echo "got this: ".$_POST["myDate"]."and:".$dbTable;
//fetch the data from the database 

//while ($row = mysqli_fetch_array($result)) {
//var_dump("trash: ".$row{'hour'});
//echo "date:" .$row{'date'}." hour:".$row{'hour'}." weather: ". $row{'weather'}." temp: ".$row{'temp'}."<br>";
//}

//close the connection

mysqli_close($dbhandle);

}

?>

</body>

</form>