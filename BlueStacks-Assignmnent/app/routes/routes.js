module.exports = app => {
  const backend_controller = require("../controllers/backend.controller.js");
  app.get("/fetch_video/:video_id", backend_controller.fetch_video);
  app.get("/video_list", backend_controller.video_list);
  app.get("/video/:video_id", backend_controller.video_details);
  app.get("/all",backend_controller.all_videos);
};
