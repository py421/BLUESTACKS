const sql = require("./db.js");


const Channel = function(channel){
  this.channel_id = channel.channel_id;
  this.title = channel.title;
  this.url = channel.url;
  this.subscribers = channel.subscribers
  this.thumb_88 = channel.thumb_88;
  this.thumb_240 = channel.thumb_88;
  this.thumb_800 = channel.thumb_800;
  this.description = channel.description;
}


Channel.create = (channel, result) => {
  sql.query("INSERT INTO channel SET ?", channel, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Channel: ",channel);
    result(null, channel);
  });
};

Channel.findById = (channelId, result) => {
  sql.query(`SELECT * FROM channel WHERE channel_id = ?`,channelId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Channel: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Channel.getAll = result => {
  sql.query("SELECT * FROM channel", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("channel: ", res);
    result(null, res);
  });
};

Channel.updateById = (c_id, channel, result) => {
  sql.query(
    "UPDATE channel SET ? WHERE channel_id = ?",
    [channel,c_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Channel: ", channel);
      result(null, channel);
    }
  );
};

Channel.truncate = (result)=>{
  sql.query("TRUNCATE table channel",(err,res)=>{
    result(null,err);
    });
}


module.exports = Channel;
