<?php
/* REquire https
// Install on server certificates!
// Follow this https://www.redhat.com/sysadmin/webserver-use-https
if ($_SERVER['https'] != "on"){
  $url = "https://".$_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
  header("Location: $url");
  die("Could not connect");
  exit;
}*/
ob_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title><!--TITLE--></title>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="3600">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="favicon.ico">
<link rel="stylesheet" type="text/css" href="static/estilo.css">
<script src="libs/d3.v4.js"></script>
<script src="static/digi_clock.js"></script>
</head>

<body>
<?php
date_default_timezone_set("Asia/Tokyo");/*$heure = $heure + 8;*//*Japan*/
$heute = date("Y-m-d");
$heure = date("H");
$myMsg = "Good Morning";
?>  
  <header class="sticky row">
    <div class="half"><p>
      <?php
      if ($heure > 12){
        $myMsg="Good Afternoon";
      }
      echo $myMsg;
      ?></p>
    </div>
    <div class="counter"><h2 id="currtime"></h2></div>
  </header>

  <div class="header"><h2>Today's weather</h2><h3>Nagoyashi, Naka-ku</h3></div>

  <nav>
     <ul>
        <li><a href="/rest-api/updata.html">Data Admin</a></li>
        <li><a target="blank" href="https://github.com/ndlopez/webApp">
          WebMaster</a></li>
        <li><a target="blank" href="https://ndlopez.github.io/jumble_game">Play Jumble</a></li>
        <li><a target="blank" href="https://ndlopez.github.io/pages/about.html">About</a></li>
     </ul>
  </nav>

<div class="clearfix">
<?php
$dbTable = "weather_data";
/*$dbhost = "127.0.0.1:3306";
$dbname = "weather";$dbuser = "root";$dbpass = "";
//when coding on the server side, should use root not kathy;
$conn = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);*/
include_once('config/myconfig.php');
if(mysqli_connect_errno()){
  die("Could not connect: ". mysqli_connect_error());
}
else{
  echo "<p>Connection to Database... OK</p>";
}

//$query = "DELETE FROM tenki WHERE date IS NULL;";
$query = "SELECT * FROM $dbTable WHERE date = '" . $heute . "' AND hour = " . $heure .";";
//mysqli_select_db($conn,'weather');

// echo "<p> Your Query was ...<br><code>".$query."</code></p>";
?>
</div>
<div class="row current" style="padding:0px;">
<div class="column">
<!--div class="container">
<div class="bottom-left"-->
<?php
$nowTenki="";
if ($result = mysqli_query($conn,$query)){
  if($result->num_rows < 1){
    /* This if doesnt work, must find a way to return sth when no rows are returned */
    echo "<h2> Database is not updated. <br>Please, contact Admin.</h2>";
  }
	foreach ($result as $row){
    $nowTenki = trim($row['weather'],'"');
    $weatherIcon = "";
    $weatherLbl = "Sunny";
    switch($nowTenki){
      case "曇り":
        $weatherIcon = "CloudyV3.svg";
        $weatherLbl = "Cloudy";
        break;
      case "弱雨":
        $weatherIcon = "LightRainV3.svg";
        $weatherLbl = "Light Rain";
        break;
      case "小雨":
        $weatherIcon = "ModerateRainV2.svg";
        $weatherLbl = "Moderate Rain";
        break;
      default:
        $weatherIcon = "MostlySunnyDay.svg";
    }
    /*echo "<h3><br>".date("l F d ").$row['hour'].":".date("i")."</h3>";*/
    $pageTitle = $nowTenki." ".$row['temp']."&#8451;";

    echo "<div class='row'><div class='column'><h2>Nagoya, JP<br/>".$weatherLbl.
    "</h2><h1>".$pageTitle."</h1></div>";
    echo "<div class='column'><img src='svg/".$weatherIcon."' width='120'></></div></div>";
	}
  echo "<div class='row xtra' style='padding:0px;'>";
	foreach ($result as $row){
    echo "<div class='col3'>";
		echo "<h4>RAIN</h4><p>".$row['mmRain']."mm</p><p>".$row['rainProb']."%</p></div>".
    "<div class='col3'><h4>HUMIDITY</h4><p>"
    .$row['humid']."%</p></div><div class='col3'><h4>";
		echo "WIND</h4><p>".$row['wind']."m/s</p><p>".$row['windDir']."</p></div>";
	}
  echo "</div>";
  echo "<p class='img2'>".date("l, F d")." ".date("H:i")."</p>";
}
else{
  http_response_code(404);
	echo "<p>Something went wrong :( <br> Contact admin@webapp.physics </p>";
}

?>
<!--/div--><!-- bottom-left class: Text above img -->
<!--/div--><!-- container class-->
</div><!-- Column container -->
<!--div class="column" style="text-align:center;">
  <a href="https://tenki.jp/forecast/5/26/5110/23106/1hour.html">
    <img alt="Click  to link tenki.jp" src="https://static.tenki.jp/static-images/radar/recent/pref-26-middle.jpg"/>
  </a>
</div-->
<div id="weather_bar" class="column"></div>
</div><!--Today weather report row-->

<button class="accordion" style="background-color:#2e4054;color:#bed2e0;">Later today</button>
<div class="panel" style="padding:0px;">
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
//Display next hour conditions
echo "";
$heure = $heure +1;
/*$heure=0;*/
$query2 = "SELECT * FROM $dbTable WHERE date = '".$heute."' AND hour BETWEEN ".$heure." AND 23;";

if ($result = mysqli_query($conn,$query2)){
	/*foreach ($result as $row){
		echo "<h3>".$row['hour'].":00 ".$row['weather'].$row['temp']."C</h3>";
	}*/
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

/*Creating a JSON file and saving to static folder
If run by using <include> the whole page crashes
and return a single JSON file with jibberish(HTML code) on it.
*/
$newQuery="SELECT * FROM $dbTable WHERE date='".$heute."';";
$json=[];
$csvFile='data/sample.csv';
$fpout = fopen($csvFile,'w');
if($fpout === false){die('Error opening file'.$csvFile);}
fputcsv($fpout,array('date','hour','weather','temp','rainProb','mmRain','humid','wind','windDir'));
//$classy="";
$myColor="";
if($res = mysqli_query($conn,$newQuery)){
  foreach ($res as $dat){
    //trim($dat);Does not trim anything
    if ($dat['hour'] == $heure - 1){
      $myColor = "#bed2e0";
    }
    elseif ($dat['hour'] < $heure -1 ) {
      $myColor = "#cc274c40";
    }
    else{
      $myColor = "#bed2e030";
    }
    /*if ($dat['hour'] < $heure) {
      $classy="bar-old";
      $myColor="#98A2A9";
    } else {
      $classy="bar-new";
      $myColor="#cc274c";
    }*/
    //trim($dat['windDir'],'/"\n/"');
    preg_replace('^\r\n','',$dat['windDir']);
    fputcsv($fpout,$dat);// write without color arg
    /*append new char to dict array */
    $dat['color']=$myColor;
    $json[] = $dat;
    //var_dump(trim($dat['windDir']));
    //str_replace('"','',$dat['weather']); Does not work
    //trim($dat['windDir'],'/\n'); does not work either
    //var_dump(trim($dat['weather'],'\"'));
  }
}
$json = json_encode($json);
file_put_contents("data/all_weather.json",$json);

/* Generate CSV file */
fclose($fpout);
mysqli_close($conn);
?>
<!--?php include 'static/get_json_db.php'?-->
<script src = "static/accordion_table.js"></script>
<script src="static/plt_weather_json.js"></script>
<!--script src="static/get_json.js"></script-->
</body>
<footer>
<div class="row" style="padding:0px;">
<div class="column">
<p>Data from <em>tenki.jp</em> scraped using <i>Shell, curl and SED</i>.</p>
</div>
<!--div class="column">empty div</div-->
<div class="column" style="text-align:right;">
<p>Hello from
  <a target="blank" href="https://www.openstreetmap.org/search?query=35.17271%2C136.89547#map=18/35.17271/136.89547">
    N35 10'53" E136 54'23"</a></p>
</div></div>
<p style="text-align:center;"><span class="copy-left">&copy;</span><span> Copyleft <?php echo date("Y-m-d");?></span></p>
</footer>
</html>
<?php
$pageContents = ob_get_contents();
ob_end_clean();
//Replace title var with content
echo str_replace('<!--TITLE-->',$pageTitle,$pageContents);
?>
