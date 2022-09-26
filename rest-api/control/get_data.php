<?php
ini_set('display_errors',1);
?>
<!DOCTYPE html>
<html>
<head>
<title>webApp: query DB</title>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="../../static/stylez.css">
</head>
<body>
    <h2>&emsp;WebApp.Physics
    <img src="../../svg/MostlySunnyDay.svg"/>
    </h2>
    <!--main>
        <form method="post">
            <label>Please select date:<br/><br/>Year:  2022</label>
            <div class="clearfix">
            <select name="tag" id="tag" class="col">
                <option>Day</option>
                <?php
                /*for ($idx=1; $idx <= 31; $idx++) {
                    $strIdx = $idx;
                    if ($idx < 10){
                        $strIdx = "0".$idx;
                    }
                    echo "<option value='".$strIdx."'>".$idx."</option>";
                }*/
                ?>
            </select></div>
        </form>
    </main-->
    <div class="clearfix">
    
<?php

require_once "../inc/config.php";

if(isset($_POST['Submit1']))
{
//connection to the mysql database,
$dbhandle = mysqli_connect(DB_HOST, DB_USER, $_POST["my_pass"], DB_NAME);

if($dbhandle === false){
    die("Error: Could not connect to DB".$dbhandle->connect_error);
}else{
    echo "<span>Connection established to: ".DB_HOST."</span>";
}

$dbTable = "weather_data";

if($_POST["monty"] == "Month" || $_POST["tag"] == "Day"){
    echo "<p>Please select a month and a day.</p>";
    exit;
}
$buildDate = "2022-".$_POST["monty"]."-".$_POST["tag"];
//previously an input text: $query = "SELECT * FROM weather_data WHERE date='".$_POST["myDate"] ."';";

$query = "SELECT * FROM weather_data WHERE date='". $buildDate ."';";

$humanDate = date('l jS \of F Y',strtotime($buildDate));
//str_getcsv($_POST["myDate"],"-"); split string by param="-"

echo "<h3>Weather report for ".$humanDate."</h3>";
echo "<h4>Get these data in <a href='/rest-api/index.php/datos/list?thisDate=".$buildDate."'>JSON format </a></h4>";
?>
</div>
<br>
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
//if(!empty($_POST["myDate"]))
if(!empty($buildDate))
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
<div class="clearfix">
    <h4 class="col"><a href="http://webapp.physics/rest-api/updata.html">Search again?</a></h4>
    <h4 class="col">Go back <a href="http://webapp.physics">Home</a></h4>
</div>
</body>

</form>