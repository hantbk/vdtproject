FROM mongo:4.4.6

COPY attendees.json /docker-entrypoint-initdb.d/attendees.json
COPY init-data.sh /docker-entrypoint-initdb.d/init-data.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-data.sh

CMD ["mongod"]
