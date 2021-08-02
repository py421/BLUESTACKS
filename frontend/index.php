<?php
require("db.php");
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

<table border=1 cellspacing=5 cellpadding=5>
<tr><th>Title</th> 
 <th>Fetch</th></tr>
<?php 
$response = url_get("https://backendapp142.herokuapp.com/all");
$response = json_decode	($response,true);
foreach($response as $video){
  	$img_src = $video['default_t'];
	$title = $video['title'];
	$vid = $video['video_id'];
	echo "<tr align='center'>
	<td ><a href = 'videoStream.php?vid=$vid' style='text-decoration:none'><img style='float:left' src='$img_src'><span> $title</span></a></td>
	<td><a href = 'https://backendapp142.herokuapp.com/fetch_video/$vid' target=none><button>Fetch Video Now</button></a></td>
	</tr>
	";
	}
?>
</table>
</body>
</html>
