import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/createUser", { name, gender, school });
      if (response.status === 201) { // Kiểm tra trạng thái trả về
        navigate("/");
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("There was an error creating the user!", err);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="w-50 bg-white rounded shadow p-4">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">Add New Member</h2>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              id="gender"
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="school" className="form-label">School</label>
            <input
              type="text"
              id="school"
              placeholder="Enter School"
              className="form-control"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
