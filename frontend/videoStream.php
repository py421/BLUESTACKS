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

 <iframe  width="100%" height="450" src="video.php?vid=<?php echo $_GET['vid']; ?>" title="Video Player" allow="autoplay; encrypted-media"></iframe> 
<table border=1 cellspacing=5 cellpadding=5>
<tr><th>Property</th> 
 <th>Value</th></tr>
<?php
	$vid = $_GET['vid'];
	$response = url_get("https://backendapp142.herokuapp.com/video/$vid");
	$response = json_decode	($response,true);
	foreach($response	 as $key => $value){
	if(is_array($value)){
		foreach($value	 as $s_key => $s_value){
			echo "<tr><td>Channel ". $s_key . " </td><td> " . $s_value . "</td></tr>";
		}
	}
	else
  	echo "<tr><td>". $key . " </td><td> " . $value . "</td></tr>";
	}
		
?>
</table>	


</body>
</html>
