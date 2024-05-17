import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateUser() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:9000/getUser/' + id)
      .then(res => {
        console.log(res);
        setName(res.data.name);
        setGender(res.data.gender);
        setSchool(res.data.school);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.put(`http://localhost:9000/updateUser/${id}`, { name, gender, school });
      console.log(result);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="w-50 bg-white rounded shadow p-4">
        <form onSubmit={handleUpdate}>
          <h2 className="mb-4 text-center">Update Member</h2>
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
          <button type="submit" className="btn btn-success w-100">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
