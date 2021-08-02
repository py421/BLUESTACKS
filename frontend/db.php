<?php

$dbhost = "mysql-41838-0.cloudclusters.net:18404";
 $dbuser = "testuser";
 $dbpass = "testuser";
 $db = "testdb";
 $conn = mysqli_connect("mysql-41838-0.cloudclusters.net:18404", "testuser", "testuser","testdb") or die("Connect failed: %s\n". $conn -> error);


function url_get($url)
{
    $ch = curl_init();     
    curl_setopt($ch, CURLOPT_URL,$url); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $urlcontent = curl_exec($ch); 
    curl_close($ch); 
    return($urlcontent);
} 
?>
