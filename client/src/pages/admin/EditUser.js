import React, { useRef, useState } from "react";
import "./EditUser.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const editFname = useRef();
  const editLname = useRef();
  const editEmail = useRef();

  const userId = location.state?._id;
  const firstname = location.state?.firstname;
  const lastname = location.state?.lastname;
  const email = location.state?.email;

  const handleSubmit = () => {
    const editedFname = editFname.current.value;
    const editedLname = editLname.current.value;
    const editedEmail = editEmail.current.value;

    if (
      editedEmail !== "" &&
      editedFname !== "" &&
      editedLname !== ""
    ) {
      axios
        .post(
          "/api/admin/edituser",
          { userId, editedFname, editedLname, editedEmail },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("adminToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            navigate("/admin/dashboard");
            toast.success("Edited successfuy!");
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => console.log(error.message));
    }
  };

  return (
    <div className="edit-body">
      <div className="edit-card">
        <h1 className="user-edit-h1">Edit Userdata</h1>
        <div className="form-group-edit">
          <label className="edit-label">First Name</label>
          <input
            type="text"
            id="firstName"
            ref={editFname}
            required
            defaultValue={firstname}
            name="firstName"
            className="form-edit"
          />
        </div>
        <div className="form-group-edit">
          <label className="edit-label">Last Name</label>
          <input
            type="text"
            id="lastName"
            ref={editLname}
            required
            defaultValue={lastname}
            name="lastName"
            className="form-edit"
          />
        </div>
        <div className="form-group-edit">
          <label className="edit-label">Email</label>
          <input
            type="email"
            id="email"
            required
            ref={editEmail}
            defaultValue={email}
            name="email"
            className="form-edit"
          />
        </div>
        <div className="btn-div-edit">
          <button onClick={handleSubmit} className="btn-primary-edit">
            Update
          </button>
        </div>

        <p>{error}</p>
      </div>
    </div>
  );
}

export default EditUser;
