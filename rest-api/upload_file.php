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
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$dbTable = "weather_data";
$csvFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

echo "<h2>Welcome: " . $_POST["my_id"]."</h2>"; 
//var_dump($csvFileType);
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = filesize($_FILES["fileToUpload"]["tmp_name"]);
  //var_dump($check);
  if($check !== false) {
    echo "File is CSV text - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    echo "File is not CSV.";
    $uploadOk = 0;
  }
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded.<br/>";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    echo "The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["name"])). " has been uploaded.<br/>";
  } else {
    echo "Sorry, there was an error uploading your file.<br/>";
  }
}
$dat = [];
if (file_exists($target_file)){
  //$fname = "uploads/tenki_hour.csv";
  $myfile = fopen($target_file, "r") or die("Unable to open file!");
  // Output one line until end-of-file
  /*while(!feof($myfile)) {
    $oneLine = str_getcsv(fgets($myfile),",");
    string splitted by char not string nor @ "," delim
    foreach ($oneLine as $dat){
      echo $dat[0].", ".$dat[1];
    }
    echo "<br>";
  }*/
  while (($row = fgetcsv($myfile)) !== false) {
    $dat[] = $row;
  }
  fclose($myfile);

  require_once "inc/config.php";

  $dbHandle = mysqli_connect(DB_HOST,DB_USER,$_POST["my_pass"],DB_NAME);
  if(mysqli_connect_errno()){
    die("Couldnt connect to DB".mysqli_connect_error());
  }
  $auxQuery = "";
  $auxStr = "";
  $upQuery = "INSERT INTO " . $dbTable . " VALUES(";
  //$upRes = mysqli_query($dbHandle,$upQuery)
  foreach($dat as $col){
    echo $col;
    if($col[0] !== "date"){
      echo $upQuery;
      //$auxQuery = $upQuery;
      for ($idx=0; $idx <9 ; $idx++) {
        if($col[$idx] == "---"){
          $col[$idx] = "0";
        }
        
        if($idx==8){
          $auxStr = $col[$idx];
          echo $col[$idx];
        }else{
          $auxStr = $col[$idx] . ",";
          echo $col[$idx].",";
        }
        
      }
      echo ")<br/>";
      $auxQuery = $upQuery . "";
      //mysqli_query($dbHandle,$upQuery);
    }
  }
  mysqli_close($dbHandle);
  //var_dump($dat);
}else{
  echo "Cannot read uploaded file.";
}
?>
</body>
</html>