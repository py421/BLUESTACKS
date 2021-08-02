<?php

require("db.php");

class VideoStream
{

    private $start  = -1;
    private $end    = -1;
    private $size   = 0;
    private $vid    = "";
    private $num_chunks = -1;
    private $current_chunk = 0;
    function __construct($vid) 
    {
	$this->vid= $vid;
    }

    private function open()
    {
	global $conn;
	$sql = "SELECT size,total_chunks from videos where video_id='$this->vid' ;";
	$result = mysqli_query($conn,$sql);
        $row = mysqli_fetch_array($result);
	$this->size = $row['size'];
	$this->num_chunks = $row['total_chunks'];
    }

    private function setHeader()
    {
        ob_get_clean();
        header("Content-Type: video/mp4");
        $this->start = 0;
        $this->end   = $this->size - 1;
        header("Accept-Ranges: bytes");
        if (isset($_SERVER['RANGE'])) {
            $c_start = $this->start;
            $c_end = $this->end;
 
            list(, $range) = explode('=', $_SERVER['RANGE'], 2);
            if (strpos($range, ',') !== false) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $this->start-$this->end/$this->size");
                exit;
            }
            if ($range == '-') {
                $c_start = $this->size - substr($range, 1);
            }else{
                $range = explode('-', $range);
                $c_start = $range[0];
                 
                $c_end = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $c_end;
            }
            $c_end = ($c_end > $this->end) ? $this->end : $c_end;
            if ($c_start > $c_end || $c_start > $this->size - 1 || $c_end >= $this->size) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $this->start-$this->end/$this->size");
                exit;
            }
            $this->start = $c_start;
            $this->end = $c_end;
            $length = $this->end - $this->start + 1;
	    
            header('HTTP/1.1 206 Partial Content');
            header("Content-Length: ".$length);
            header("Content-Range: bytes $this->start-$this->end/".$this->size);
        }
        else
        {
		
           header("Content-Length: ".$this->size); 
        }
    }

    private function end()
    {
        exit;
    }

    private function stream()
    {
	global $conn;
        set_time_limit(0);
	while($this->current_chunk < $this->num_chunks){
 	    $sql = "SELECT data from videoChunk where video_id='$this->vid' and chunk_id=$this->current_chunk;";
	    $result = mysqli_query($conn,$sql);
	    $row = mysqli_fetch_array($result);
	    $this->current_chunk  = $this->current_chunk+1;
	    $data = $row['data'];
	    echo $data;		
	    flush();
	}
    }

    function start()
    {
        $this->open();
        $this->setHeader();
        $this->stream();
        $this->end();
    }
}
?>
<?php
$video_id =  $_GET['vid'];
$stream = new VideoStream($video_id);
$stream->start(); ?>




