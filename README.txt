NOTE: This is not for Commercial Use. This is only for Educational Purpose.
REQUIREMENTS:
php version 7.x
MySQL version 5.7
NodeJS version 15.7
XAMPP server version 7.3


STEPS:
1. Clone the Repository 
2. cd BlueStacks-Assignment
3. npm install
4. node server 
5. sudo service mysqld start 
6. Login into mysql and execute "source path_to_mysql-41838-db_mysql-41838.sql;" (without quotes)
7. Copy frontend folder to /opt/lampp/htdocs
8. sudo /opt/lampp/lampp startapache
9. Go to localhost/frontend for Front end 
10. Go to localhost:3000/video_list for saving trending video list into DB
11. Go to localhost:3000/fetch_video/:video_id for downloading video into DB
12. Go to localhost:3000/all for getting the list of available list of videos
13. Go to localhost:3000/video/:video_id for getting all details of video and it's channel

Hosted Website Link:
FrontEnd - https://frontendapp142.herokuapp.com
BackEnd - https://backendapp142.herokuapp.com/
