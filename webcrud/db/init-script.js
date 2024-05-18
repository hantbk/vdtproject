// Import thư viện mongoose
const mongoose = require('mongoose');

// Định nghĩa schema cho model Attendee
const attendeeSchema = new mongoose.Schema({
  name: String,
  gender: String,
  school: String
});

// Tạo model Attendee từ schema đã định nghĩa
const Attendee = mongoose.model('Attendee', attendeeSchema);

// Import file attendees.json
const attendeesData = require('./attendees.json');

// Thiết lập kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/crud', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Nạp dữ liệu từ attendees.json vào cơ sở dữ liệu
    return Attendee.insertMany(attendeesData);
  })
  .then(() => {
    console.log('Data inserted successfully');
    // Đóng kết nối tới MongoDB
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
