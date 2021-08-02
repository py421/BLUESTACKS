const Video = require("../models/video.model.js");
const Channel = require("../models/channel.model.js");
const fetch = require('node-fetch');
var JSSoup = require('jssoup').default;
const fs = require('fs');
const ytdl = require('ytdl-core');
const VideoChunk = require("../models/videoChunk.model.js");
const chunk_size = 500000
require('dotenv').config()



exports.video_list = (req, res) => {
  Video.truncate((err, data) => {
    if (err)
      console.log(err)
  });
  Channel.truncate((err, data) => {
    if (err)
      console.log(err)
  });
  VideoChunk.truncate((err, data) => {
    if (err)
      console.log(err)
  });
  try {
    fetch(new URL("feed/trending", "https://www.youtube.com")).then(response => {
      response.text().then(html => {
        var soup = new JSSoup(html);
        var scripts = soup.findAll('script');
        scripts.forEach(script_element => {
          var text = script_element.text;
          if (text.includes("var ytInitialData =")) {
            text = text.replaceAll("var ytInitialData =", "")
            text = text.replaceAll(";", "")
            const obj = JSON.parse(text);

            const video_list = obj.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents
            let final_list = []
            for (var i = 0; i < video_list.length - 1; i++) {
              console.log(i);
              if (video_list[i].itemSectionRenderer != undefined)
                final_list = final_list.concat(video_list[i].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items)
              else {
                let tmp_obj = video_list[i].richSectionRenderer.content.richShelfRenderer.contents;
                for (let j = 0; j < tmp_obj.length; j++) {
                  final_list.push(tmp_obj[j].richItemRenderer.content.videoRenderer)
                }
              }
            }
            // res.json(final_list);
            let response = []
            final_list.forEach(video => {
              create(video.videoRenderer, (n_video) => response.push(n_video));
            });
            res.json({
              "list": response
            });
          }
        });
      });


    });
  } catch (err) {
    console.error(err);
  }
}

async function create(video, result) {
  try {
    let n_video = new Video({
      video_id: video.videoId,
      title: video.title.runs[0].text,
      url: "https://www.youtube.com/watch?v=" + video.videoId,
      description: video.descriptionSnippet ? video.descriptionSnippet.runs[0].text : "",
      size: 0,
      views: video.viewCountText.simpleText,
      likes: 0,
      dislikes: 0,
      default_t: "https://i.ytimg.com/vi/" + video.videoId + "/default.jpg",
      hqdefault_t: "https://i.ytimg.com/vi/" + video.videoId + "/hqdefault.jpg",
      mqdefault_t: "https://i.ytimg.com/vi/" + video.videoId + "/mqdefault.jpg",
      sddefault_t: "https://i.ytimg.com/vi/" + video.videoId + "/sddefault.jpg",
      maxresdefault_t: "https://i.ytimg.com/vi/" + video.videoId + "/maxresdefault.jpg",
      channel_id: video.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId
    });
    Video.create(n_video, (err, data) => {
      if (err)
        console.log(err)
    });
    Channel.create(new Channel({channel_id:n_video.channel_id}),(err,result)=>{});
    result(n_video);
  } catch (err) {
    console.error(err);
  }
}

exports.video_details = (req, res) => {
  const current_video_id = req.params.video_id;
  Video.findById(current_video_id, (err, result) => {
    
    Channel.findById(result.channel_id,(err,channel)=>{
      if(err){
        res.json(err);
        return;
      }
      delete channel['channel_id'];
      result['channel_details']=channel;
      res.json(result);
    });

  })

}


fetch_video_details = (video_id, result) => {
  const url = new URL("watch?v=" + video_id, "https://www.youtube.com")
  try {
    fetch(url).then(response => {
      response.text().then(html => {
        try {
          var soup = new JSSoup(html);
          var scripts = soup.findAll('script');
          scripts.forEach(script_element => {
            var text = script_element.text;
            if (text.startsWith("var ytInitialData =")) {
              text = text.replaceAll("var ytInitialData =", "")
              text = text.replaceAll(";", "")
              const obj = JSON.parse(text);
              const new_obj = {
                likes: obj.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip.split('/')[0],
                dislikes: obj.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip.split('/')[1],
                channel_details: obj.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer
              }
              result(null, new_obj);
            }
          });

        } catch (err) {
          console.error(err);

        }
      });
    });
  } catch (err) {
    console.error(err);
  }

};


update_or_create_channel = (obj) => {
  try {
    const c_id = obj.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId;
    let c_description = ""
    for (let i = 0; i < obj.description.runs.length; i++) {
      c_description = c_description + obj.description.runs[i].text;
    }
    const c_url = "https://www.youtube.com" + obj.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl;
    const channel = new Channel({
      channel_id: c_id,
      title: obj.owner.videoOwnerRenderer.title.runs[0].text,
      url: c_url,
      subscribers: obj.owner.videoOwnerRenderer.subscriberCountText.simpleText,
      thumb_88: obj.owner.videoOwnerRenderer.thumbnail.thumbnails[0] ? obj.owner.videoOwnerRenderer.thumbnail.thumbnails[0].url : "",
      thumb_240: obj.owner.videoOwnerRenderer.thumbnail.thumbnails[1] ? obj.owner.videoOwnerRenderer.thumbnail.thumbnails[1].url : "",
      thumb_800: obj.owner.videoOwnerRenderer.thumbnail.thumbnails[2] ? obj.owner.videoOwnerRenderer.thumbnail.thumbnails[2].url : "",
      description: c_description
    });
    Channel.findById(c_id, (err, result) => {
  
      if (result == null) {
        Channel.create(channel, (err, result) => {

        })
      } else
        Channel.updateById(c_id, channel, (err, result) => {})
    });
  } catch (err) {
    console.error(err);
  }
}

exports.all_videos = (req, res) => {
  Video.findAll((err, result) => {
    if(err){
      res.json(err);
      return;
    }
    res.json(result);
  })
}

exports.fetch_video = (req, res) => {
  const current_video_id = req.params.video_id;
  console.log(current_video_id);
  var url = "https://www.youtube.com/watch?v=" + current_video_id;
  let file_size;
  VideoChunk.findByVideoId(current_video_id, (err, chunk_available) => {
    console.log(chunk_available)
    if (chunk_available == null || chunk_available == undefined) {
      let stream = ytdl(url, {
        format: 'mp4'
      }).pipe(fs.createWriteStream('video.mp4'));
      stream.on('finish', function () {
        fs.stat('video.mp4', function (err, stats) {
          const fileSize = stats.size;
          fs.open('video.mp4', 'r', function (errOpen, fd) {
            fs.read(fd, Buffer.alloc(fileSize), 0, fileSize, 0, async function (errRead, bytesRead, buffer) {
              const num_chunks = parseInt(bytesRead / chunk_size) + 1;
              Video.updateById(current_video_id, {
                size: bytesRead,
                total_chunks: num_chunks
              }, (err, result) => {
                if(err){
                  res.json(err);
                  return;
                }
              });
              for (let i = 0; i < num_chunks; i++) {
                let start = i * chunk_size;
                let end = (i + 1) * chunk_size;
                if (end > bytesRead)
                  end = bytesRead;
                let chunk_data = buffer.slice(start, end);
                const n_video_chunk = new VideoChunk({
                  video_id: current_video_id,
                  chunk_id: i,
                  data: chunk_data
                });
                VideoChunk.create(n_video_chunk, (err, result) => {});
              }
              fs.unlink("video.mp4", (err, result) => {});
              });
            });
          });
        
        });
      }
  });   

  fetch_video_details(current_video_id, (err, result) => {
    if(err){
      res.json(err);
      return;
    }
    let channel_details = result['channel_details'];
    delete result['channel_details'];
    Video.updateById(current_video_id, {
      ...result
    }, (err, result) => {
      if(err){
        res.json(err);
        return;
      }
    });
    update_or_create_channel(channel_details);
    res.send("Video Queued.  <br> DB are remote and it takes time to upload video into db. Pleae use /video/videoId to see if video is fetched or not (if size=0 means its still in progress)");
  });
};