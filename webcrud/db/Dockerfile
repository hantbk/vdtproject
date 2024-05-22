FROM mongo:4.4.6

# Tạo thư mục để chứa dữ liệu và script khởi tạo
RUN mkdir -p /docker-entrypoint-initdb.d

# Sao chép tệp attendees.json vào thư mục /docker-entrypoint-initdb.d/
COPY attendees.json /docker-entrypoint-initdb.d/attendees.json

# Sao chép tệp init-data.sh vào thư mục /docker-entrypoint-initdb.d/
COPY init-data.sh /docker-entrypoint-initdb.d/init-data.sh

# Đặt quyền thực thi cho tệp init-data.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-data.sh

# Chạy init-data.sh để khởi tạo dữ liệu trong MongoDB và sau đó khởi động MongoDB
CMD ["bash", "-c", "/docker-entrypoint-initdb.d/init-data.sh && mongod --bind_ip_all"]
