## Project giữa kỳ
### Nguyễn Thanh Hà

### Phát triển một 3-tier web application đơn giản 
Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin sau: Họ và tên, Giới tính, trường đang theo học. 
![Home](./image/danhsachsv.png)
Cho phép xem chi tiết/thêm/xóa/cập nhật thông tin sinh viên.

- Thêm sinh viên
![Create](./image/createUser1.png)
![Create](./image/createUser2.png)

- Xem chi tiết sinh viên
![Detail](./image/ListUserInfo.png)

- Cập nhật thông tin sinh viên
![Update](./image/updateUser1.png)
![Update](./image/updateUser2.png)

- Xóa sinh viên
![Delete](./image/deleteUser.png)

 - Mã nguồn frontend: [web](./webcrud/web/)
 - Mã nguồn backend: [api](./webcrud/api/app.js)
 - Mã nguồn database: [db](./webcrud/db/)

 - Kết quả unit test cho các chức năng API: 
 ![unit_test](./image/unit_test.png)

 - Mã nguồn unit test cho các chức năng API: [unit_test](./webcrud/api/tests/)

### Triển khai web application sử dụng các DevOps tools & practices

#### 1. Containerization 
 - Dockerfile cho từng dịch vụ: 
- [Web](./webcrud/web/Dockerfile) 
    ```Dockerfile
    # Stage 1: Build the React app
    FROM node:lts-alpine AS build

    # Set working directory
    WORKDIR /app

    # Copy package.json and package-lock.json
    COPY package.json .
    COPY package-lock.json .

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Build the React app
    RUN npm run build

    # Stage 2: Serve the built React app
    FROM nginx:alpine

    # Copy the built React app from the previous stage
    COPY --from=build /app/dist /usr/share/nginx/html

    # Copy nginx configuration file
    COPY nginx.conf /etc/nginx/conf.d/default.conf

    # Expose port 80
    EXPOSE 80

    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    ```
- [Api](./webcrud/api/Dockerfile)

    ```Dockerfile
    # Stage 1: Build the application
    FROM node:lts-alpine AS build

    WORKDIR /app

    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./

    # Install dependencies
    RUN npm ci --only=production

    # Copy the rest of the application code to the working directory
    COPY . .

    # Stage 2: Production-ready image
    FROM node:lts-alpine AS production

    WORKDIR /app

    # Copy only necessary files from build stage
    COPY --from=build /app/package*.json ./
    COPY --from=build /app/node_modules ./node_modules
    COPY --from=build /app/server.js ./

    # Expose the port that app runs on
    EXPOSE 3000

    # Command to run your app
    CMD ["node", "server.js"]

    ```
- [Db](./webcrud/db/Dockerfile)

    ```Dockerfile
    FROM mongo:4.4.6

    COPY attendees.json /docker-entrypoint-initdb.d/attendees.json
    COPY init-data.sh /docker-entrypoint-initdb.d/init-data.sh

    RUN chmod +x /docker-entrypoint-initdb.d/init-data.sh

    CMD ["mongod"]

    ```
- Output câu lệnh build và history image web service

    ![alt](./image/web_image.png)

    ![alt](./image/web_history.png)

- Output câu lệnh build và history image api service

    ![alt](./image/api_image.png)

    ![alt](./image/api_history.png)

- Output câu lệnh build và history image db service

    ![alt](./image/db_image.png)

    ![alt](./image/db_history.png)

#### 2. Continuous Integration
 - File setup công cụ CI:

    ```yaml
    # This workflow will install Python dependencies, run tests and lint with a single version of Python
    # For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python

    name: Python application

    on:
      push:
        branches:
          - '*'
      pull_request:
        branches: [ "master" ]

    permissions:
      contents: read
      pull-requests: write
    jobs:
      build:

        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3
        - name: Set up Python 3.10
          uses: actions/setup-python@v3
          with:
            python-version: "3.10"
        - name: Install dependencies
          run: |
            python -m pip install --upgrade pip
            python -m pip install flake8 pytest pytest-cov bson
            pip install -r ./sonbm/app/requirements.txt
        - name: Lint with flake8
          run: |
            # stop the build if there are Python syntax errors or undefined names
            flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
            # exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
            flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
        - name: Test with pytest
          run: |
            pytest --cov-report "xml:coverage.xml"  --cov=.
        - name: Create Coverage 
          if: ${{ github.event_name == 'pull_request' }}
          uses: orgoro/coverage@v3
          with:
              coverageFile: coverage.xml
              token: ${{ secrets.GITHUB_TOKEN }}

    ```
- Output log của luồng CI
     
     ![alt](./images/log-test-CI.png)

- Lịch sử chạy CI

    ![alt](./images/lich-su-CI.png)
    
- Tự động chạy test khi Pull request, Python Coverage

    ![alt](./images/CI-PR1.png)

    ![alt](./images/CI-.png)

#### 3. Continuous Delivery

- Ảnh minh họa kiến trúc triển khai và bản mô tả

    ![alt](./images/mohinh.png)

    - Hệ thống có 3 host bao gồm 1 máy chính(localhost) và 2 máy ảo bên trong nó. Mỗi host sẽ đều triển khai cả 3 service của Webapp đó là frontend, backend, database.
    => Tổng cộng mỗi dịch vụ sẽ được triển khai trên 3 Container khác nhau

    - 1 con nginx sẽ được triển khai trên máy chính nhằm thực hiện việc cân bằng tải frontend, backend trên cả 3 máy 
    - File cấu hình Load balancer được hiển thị tại [đây](./Ansible/roles/lb/templates/nginx.conf) 

- Video kiểm tra hoạt động của bộ cân bằng tải ( bên trong thư mục images)

  ![alt](./images/test-lb.gif)

- File setup CD 

    ```yaml
    name: Build and push images to DockerHub

  on:
    push:
      tags:
        - '*'

  jobs:
    build-and-push:
      name: Build and Push image to DockerHub
      runs-on: ubuntu-latest
      steps:   
        - name: Check out the repo
          uses: actions/checkout@v3

        - name: Log in to Docker Hub
          uses: docker/login-action@v2
          with:
            username: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_PASSWORD }}

        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v2

        - name: Build and push Backend Docker image
          uses: docker/build-push-action@v4
          with:
            context: "{{defaultContext}}:sonbm/app"
            push: true
            tags: ${{ secrets.DOCKERHUB_USERNAME }}/sonbm-app:${{  github.ref_name }}

        - name: Build and push Frontend Docker image
          uses: docker/build-push-action@v4
          with:
            context: "{{defaultContext}}:sonbm/frontend"
            push: true
            tags: ${{ secrets.DOCKERHUB_USERNAME }}/sonbm-frontend:${{  github.ref_name }}
      ```

- Output của luồng build và push Docker Image lên Docker Hub

    ![alt](./images/luong-build-push.png)

  - Output log Backend

    ![alt](./images/CD-log-backend.png)

  - Output log Frontend

    ![alt](./images/CD-log-frontend.png)

- Lịch sử CD

    ![alt](./images/lich-su-CD.png)

- Hướng dẫn sử dụng `ansible playbook` để triển khai các thành phần hệ thống

  Kiến trúc Ansible: 

    ![alt](./images/tree-ansible.png)

  - Danh sách các roles: 
     
    - [common](./Ansible/roles/common/tasks/main.yaml)
    - [web](./Ansible/roles/web/tasks/main.yaml)
    - [api](./Ansible/roles/api/tasks/main.yaml)
    - [db](./Ansible/roles/db/tasks/main.yaml)
    - [lb](./Ansible/roles/lb/tasks/main.yaml)


  Sử dụng lệnh sau để chạy Ansible playbook:
  `ansible-playbook -i Ansible/inventory/inventory.yaml Ansible/setup.yaml`

  Với cấu hình file playbook là [setup.yaml](./Ansible/setup.yaml)

  ```yaml
  ---
  - name: log
    hosts: localhost
    become: true
    gather_facts: true
    roles:
      - logging



  - name: sonbm
    hosts: all
    become: true
    gather_facts: true
    roles:
      - common
      - db
      - web
      - api
      - monitor

  - name: lb
    hosts: localhost
    become: true
    gather_facts: true
    roles:
      - lb
  ```

- Output log triển khai hệ thống

    ![alt](./images/log-ansible1.png)

    ![alt](./images/log-ansible2.png)

    ![alt](./images/log-ansible-3.png)

    ![alt](./images/log-ansible4.png)

    ![alt](./images/log-ansible5.png)

    ![alt](./images/log-ansible6.png)

#### 4. Monitoring
- Role monitor chứa các playbook và cấu hình giám sát cho hệ thống
  - Ta có file thực thi role monitor lại [đây](./Ansible/roles/monitor/tasks/main.yaml) 
  - File cấu hình Prometheus tại [đây](./Ansible/roles/monitor/prometheus/prometheus.yml)

- Ảnh chụp dashboard giám sát nodes & containers, có thể sử dụng hệ thống prometheus tập trung ở 171.236.38.100:9090

  ![alt](./images/query-prom.png)

#### 5. Logging

- Ansible playbook triển khai các dịch vụ collect log (tách module logging)

  - File thực thi role logging tại [đây](./Ansible/roles/logging/tasks/main.yaml)

  - File cấu hình FLuentd tại [đây](./Ansible/roles/logging/files/fluentd/conf/fluent.conf)

  - Kết quả index lấy từ Kibana

    ![alt](./images/index-kibana.png)

  - Kết quả sample log lấy từ Kibana

    ![image](https://github.com/bmson7112/Viettel-Digital-Talent-2023/assets/79183573/a9c6f568-e32d-45f1-852c-255665816f21)
