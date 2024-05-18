# FROM mongo:4.4.6

# # Sao chép tệp attendees.json và init-data.sh vào thư mục /docker-entrypoint-initdb.d/
# COPY attendees.json /docker-entrypoint-initdb.d/attendees.json
# COPY init-data.sh /docker-entrypoint-initdb.d/init-data.sh

# # Đặt quyền thực thi cho tệp init-data.sh
# RUN chmod +x /docker-entrypoint-initdb.d/init-data.sh

# # Khởi động MongoDB
# CMD ["--bind_ip_all"]

# Sử dụng image chứa MongoDB
FROM mongo:4.4.6

# Copy script initialization vào thư mục làm việc
COPY init-script.js /docker-entrypoint-initdb.d/

# Copy file attendees.json vào thư mục làm việc
COPY attendees.json /usr/src/app/

# Mở cổng 27017 để truy cập MongoDB
EXPOSE 27017

# Command để chạy MongoDB
CMD ["mongod"]

