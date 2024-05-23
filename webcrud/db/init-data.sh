#!/bin/bash
# Khởi động MongoDB trong chế độ background để có thể thực thi lệnh mongoimport
mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db --bind_ip_all

# Đợi MongoDB khởi động hoàn toàn
sleep 5

# Kiểm tra xem collection có dữ liệu hay không
DATA_EXISTS=$(mongo webcrud --eval "db.vdt2024.count()" --quiet)

# Chỉ nhập dữ liệu nếu collection rỗng
if [ "$DATA_EXISTS" -eq 0 ]; then
  echo "Collection is empty. Importing data..."
  mongoimport --db webcrud --collection vdt2024 --file /docker-entrypoint-initdb.d/attendees.json --jsonArray
else
  echo "Collection already has data. Skipping import."
fi

# Dừng MongoDB sau khi hoàn thành
mongod --shutdown
