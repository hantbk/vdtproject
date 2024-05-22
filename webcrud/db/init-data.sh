#!/bin/bash
# Khởi động MongoDB trong chế độ background để có thể thực thi lệnh mongoimport
mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db --bind_ip_all

# Đợi MongoDB khởi động hoàn toàn
sleep 5

# Nhập dữ liệu từ attendees.json vào cơ sở dữ liệu MongoDB
mongoimport --db webcrud --collection vdt2024 --file /docker-entrypoint-initdb.d/attendees.json --jsonArray

# Dừng MongoDB sau khi nhập xong
mongod --shutdown
