import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

function Users() {
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(8);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    axios
    .get(`http://localhost:9000`)
      .then((res) => {
        const totalCount = res.data.length; // Tính tổng số lượng người dùng
        setPageCount(Math.ceil(totalCount / perPage)); // Sử dụng Math.ceil để làm tròn lên
        setUsers(res.data.slice(offset, offset + perPage)); // Sử dụng slice để cắt mảng users thành một mảng con
      })
      .catch((err) => console.log(err));
  }, [offset, perPage]);

  const handleDelete = (id) => {
    axios
    .delete(`http://localhost:9000/deleteUser/${id}`)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage * perPage);
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-4">
        <h1 className="text-center">Danh sách VDT 2024</h1>
      </div>
      <div className="w-75 bg-white rounded p-3">
        <div className="mb-2 text-end">
          <Link to="/create" className="btn btn-success">
            Add +
          </Link>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>School</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.gender}</td>
                <td>{user.school}</td>
                <td>
                  <Link
                    to={`/list/${user._id}`}
                    className="btn btn-info me-2"
                  >More Info</Link>
                  <Link
                    to={`/update/${user._id}`}
                    className="btn btn-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;
