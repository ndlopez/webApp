<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$csvFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
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

  $auxVar="";
  foreach($dat as $col){
    if($col[0] !== "date"){
      for ($idx=0; $idx <9 ; $idx++) {
        if($col[$idx] == "---"){
          $col[$idx] = "-1";
        }
        echo $col[$idx].",";
      }
      echo "<br/>";
    }
  }
  //var_dump($dat);
}else{
  echo "Cannot read uploaded file.";
}
?>
