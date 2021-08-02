const sql = require("./db.js");

const Video = function(video) {
  this.video_id = video.video_id;
  this.title = video.title;
  this.url = video.url;
  this.description = video.description;
  this.size = video.size;
  this.total_chunks = video.total_chunks;
  this.views = video.views;
  this.likes = video.likes;
  this.dislikes = video.dislikes;
  this.default_t = video.default_t;
  this.hqdefault_t = video.hqdefault_t;
  this.mqdefault_t = video.mqdefault_t;
  this.sddefault_t = video.sddefault_t; 
  this.maxresdefault_t = video.maxresdefault_t;  
  this.channel_id  = video.channel_id
};

Video.create = (newvideo, result) => {
  sql.query("INSERT INTO videos SET ?", newvideo, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created video: ", { id: res.insertId, ...newvideo });
    result(null, { id: res.insertId, ...newvideo });
  });
};

Video.findById = (videoId, result) => {
  sql.query(`SELECT * FROM videos WHERE video_id = "${videoId}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found video: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Video.findAll = result => {
  sql.query("SELECT * FROM videos", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("video: ", res);
    result(null, res);
  });
};

Video.updateById = (video_id, video, result) => {
  sql.query(
    "UPDATE videos SET ? WHERE video_id = ?",
    [video,video_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        console.log("not found");
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated video: ", video);
      result(null, video);
    }
  );
};

Video.truncate = (result)=>{
  sql.query("TRUNCATE table videos",(err,res)=>{
    result(null,err);
    });
}


module.exports = Video;
