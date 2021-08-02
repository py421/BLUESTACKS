const sql = require("./db.js");

const VideoChunk = function(videoChunk) {
  this.video_id = videoChunk.video_id;
  this.chunk_id = videoChunk.chunk_id;
  this.data = videoChunk.data;
};

VideoChunk.create = (videoChunk, result) => {
  sql.query("INSERT INTO videoChunk SET ?", videoChunk, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created video: ", { id: videoChunk.video_id,chunk_id:videoChunk.chunk_id });
    result(null,{ id: videoChunk.video_id,chunk_id:videoChunk.chunk_id });
  });
};

VideoChunk.findByVideoId = (videoChunkId, result) => {
  sql.query(`SELECT * FROM videoChunk WHERE video_id = ?`, videoChunkId,(err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found videoChunk: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

VideoChunk.truncate = (result)=>{
  sql.query("TRUNCATE table videoChunk",(err,res)=>{
    result(null,err);
    });
}

module.exports = VideoChunk;