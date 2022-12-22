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
<link rel="stylesheet" type="text/css" href="static/form_stylez.css">
<script src="libs/d3.v4.js"></script>
<!--script src="static/digi_clock.js"></script-->
</head>

<body>
<?php
date_default_timezone_set("Asia/Tokyo");/*$heure = $heure + 8;*//*Japan*/
$heute = date("Y-m-d");
$heure = date("H");
$myMsg = "Good Morning";
?>  
  <header class="sticky row">
    <div class="counter row">
      <div class="column">
      <h3 id="this_date"><?php echo date("l, F d")?></h3>
      <h2 id="currtime"></h2></div>
    </div>
    <div class="half">
      <ul>
        <li><a href="#" onclick="openNav()">Data Admin</a></li>
        <li><a target="_blank" href="/data/all_weather.json">Raw Data</a></li>
        <li><a target="_blank" href="/svg/jma_weather.html">Obs Data</a></li>
        <li><a target="_blank" href="https://ndlopez.github.io/pages/about.html">About</a></li>
      </ul>
    </div>
  </header>

  <div class="header"><h1>WebApp.Physics</h1>
  <h3>a web application to display weather fetched from tenki.jp</h3></div>

  <nav></nav>

<!--div class="clearfix"-->
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
  if ($heure > 12){
    $myMsg="Good Afternoon";
  }

  echo "<div id='thisWeather' class='row'>";
  echo "<p class='column' style='text-align:left;'>".$myMsg.",<br/> connection to Database... OK</p></div>";
}

//$query = "DELETE FROM tenki WHERE date IS NULL;";
$query = "SELECT * FROM $dbTable WHERE date = '" . $heute . "' AND hour = " . $heure .";";

$getMaxMin = "SELECT MAX(temp),MIN(temp) from $dbTable WHERE date='".$heute."';";
// echo "<p> Your Query was ...<br><code>".$query."</code></p>";
?>
<!--/div clearfix-->

<div class="row current" style="padding:0px;">
<div class="column">

<?php
$tempMaxMin = ""; 
if($result = mysqli_query($conn,$getMaxMin)){
  foreach($result as $dat){
    //var_dump($dat);
    $tempMaxMin = "Min ".$dat['MIN(temp)']."&#8451; | Max ".$dat['MAX(temp)']."&#8451;";
  }
}
$nowTenki="";
if ($result = mysqli_query($conn,$query)){
  if($result->num_rows < 1){
    /* if this doesnt work, must find a way to return sth when no rows are returned */
    echo "<h2> Database is not updated. <br>Please, contact Webmaster.</h2>";
  }
	foreach ($result as $row){
    $nowTenki = trim($row['weather'],'"');
    $weatherIcon = "";
    $weatherLbl = " Cloudy";
    switch($nowTenki){
      case "曇り":
        $weatherIcon = "cloudy_all.svg";
        $weatherLbl = " Cloudy";
        break;
      case "弱雨":
        $weatherIcon = "LightRainV3.svg";
        $weatherLbl = " Light Rain";
        break;
      case "小雨":
        $weatherIcon = "ModerateRainV2.svg";
        $weatherLbl = " Moderate Rain";
        break;
      case "雨":
        $weatherIcon = "rainy.svg";
        $weatherLbl = " Heavy Rain";
        break;
      case "強雨":
        $weatherIcon = "rainy.svg";
        $weatherLbl = " Heavy Rain";
        break;
      case "みぞれ":
        $weatherIcon = "SnowCloudy.svg";
        $weatherLbl = " Sleet Rain";
        break;
      case "晴れ":
        $weatherIcon = "SunnyDayV3.svg";
        $weatherLbl = " Clear and Sunny";
        break;
      default:
        $weatherIcon = "MostlySunnyDay.svg";//
    }
    /*echo "<h3><br>".date("l F d ").$row['hour'].":".date("i")."</h3>";*/
    $pageTitle = $nowTenki." ".$row['temp']."&#8451;";
    // <!--current weather div start-->
    echo "<div class='row'><div class='column'><h2>Takayama, JP</h2><p>".date("H:i").$weatherLbl.
    "</p><h1>".$pageTitle."</h1></div>";
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

  echo "<div id='maxmin' class='row'><p class='column'></p>";
  echo "<p class='column' style='text-align:right;'>".$tempMaxMin."</p></div>";
}
else{
  http_response_code(404);
	echo "<p>Something went wrong :( <br> Contact admin@webapp.physics </p>";
}
?>
</div><!-- column container -->

<div id="weather_bar" class="column"></div><!--Today weather report row-->

</div> <!--current weather div end-->
<!--div class="column" style="text-align:center;">
  <a href="https://tenki.jp/forecast/5/26/5110/23106/1hour.html">
    <img alt="Click  to link tenki.jp" src="https://static.tenki.jp/static-images/radar/recent/pref-26-middle.jpg"/>
  </a></div-->

<button class="accordion">LATER TODAY</button>
<div class="panel" style="padding:0px;">
<table id="myday">
  <tr>
    <th>時刻</th><th>天気</th>
    <th>気温<br>&#8451;</th>
    <th>降水量<br>mm</th>
    <th>降水率<br>%</th>
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
		echo "<td>".$row['mmRain']."</td><td>".$row['rainProb']."</td><td>".$row['humid'] ."</td>";
		echo "<td>".$row['wind']."</td><td>".$row['windDir']."</td></tr>";
	}
	echo "</table></div>";//div panel close
}
else{
	echo "<p>Something went wrong</p>";
}
//forecast Div
//echo "";
//echo "<div class='clearfix' id='foreDiv'><h2>Tomorrow's Weather</h2>";
//echo "<div class='col3'><br/><h2 style='text-align:left;'>".
//date("l, F d",strtotime('+1 day'))."</h2></div></div>";

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

<!--script src = "static/build_data.js"></script-->
<!--?php include 'static/get_json_db.php'?-->
<script src = "static/accordion_table.js"></script>
<script src="static/plt_weather_json.js"></script>
<!--script src="static/getJmaData.js"></script-->

<script src="static/fill_date.js"></script>

<div id="formNav" class="blurred">
  <main>
    <div class="formHead"><span class='closeBtn' onclick="closeNav('formNav')">&times;</span></div>
    <div class="tab">
      <button class="tabLink" onclick="openForm(event,'query')" id="thisOpen">Search</button>
      <button class="tabLink" onclick="openForm(event,'upload')">Update</button>
    </div>
    <div id="query" class="tabContent">
      <h2>Search for data into Weather DB</h2><p>Enter your account details</p>
        <form action="rest-api/control/get_data.php" method="post">
          <label for="fname">User Id</label>
          <input type="text" id="my_id" name="my_id" placeholder="Username...">

          <label for="fname">Password</label>
          <input type="password" id="my_pass" name="my_pass" placeholder="Your DB pass...">
      
          <br/><!--label for="lname">Select date:<br><br>Year: 2022</label><br/><br/-->
          <label for="setDate">Select date:&emsp;</label>
          <input type="date" id="setDate" name="setDate"><br/>
          <input type="submit" value="SUBMIT" name="Submit1">
        </form></div>
    <div id="upload" class="tabContent">
      <h2>Update Weather DB</h2><p>Enter your account details</p>
      <form action="rest-api/control/read_csv.php" method="post">
        <label for="fname">User Id</label>
        <input type="text" id="my_id" name="my_id" placeholder="Username...">
        <label for="fname">Password</label>
        <input type="password" id="my_pass" name="my_pass" placeholder="Your DB pass...">
        <label for="setDate">Select date:&emsp;</label>
        <input type="date" id="setDate" name="setDate"><br/>
        <input type="submit" value="UPDATE" name="submit">
      </form>
    </div>
  </main>
</div>

</body>
<footer>
<div class="row" style="padding:0px;">
<div class="column">
<p>Data from <em>tenki.jp</em> scraped using <i>Shell, curl and SED</i> and <em>JMA.go.jp</em></p>
<p>Apache/2.4.54 (Debian) Server on WSL</p>
</div>
<!--div class="column">empty div</div-->
<div class="column" style="text-align:right;">
<p><img src="svg/globe-asia.svg" width="32"/> Hello from
  <a target="blank" href="https://www.openstreetmap.org/search?query=35.17271%2C136.89547#map=18/35.17271/136.89547">
    N35 10' E136 54'</a></p>
</div></div>
<p style="text-align:center;"><span class="copy-left">&copy;</span><span> copyLeft ndzerglink 2022-12-22</span></p>
<!--?php echo date("Y-m-d");?-->
</footer>
</html>
<?php
$pageContents = ob_get_contents();
ob_end_clean();
//Replace title var with content
echo str_replace('<!--TITLE-->',$pageTitle,$pageContents);
?>
