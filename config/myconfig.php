<?php
$config = parse_ini_file('weather.ini');
$conn = mysqli_connect($config['dbhost'], $config['dbuser'], $config['dbpass']);
mysqli_select_db($conn, $config['dbname']);
