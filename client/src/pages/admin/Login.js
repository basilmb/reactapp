import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBCol, MDBRow, MDBCheckbox, MDBBtn } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice";

const styles = {
  container: {
    width: "400px",
    height: "auto",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    password: "",
  });

  const { name, password } = adminInfo;

  const handleFormData = async (event) => {
    try {
      event.preventDefault();

      if (!name || !password) {
        toast.error("Please fill the form");
      } else if (password.length < 6) {
        toast.error("Password should contain at least 6 characters!");
      } else {
        const formData = {
          name,
          password,
        };
        dispatch(showLoading())
        const response = await axios.post("/api/admin/login", formData);
        dispatch(hideLoading())
        if (response.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("adminToken", response.data.data);
          navigate("/admin/dashboard");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleFormData}>
        <MDBInput
          className="mb-4"
          type="text"
          id="form2Example1"
          label="Admin name"
          value={name}
          onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="form2Example2"
          label="Password"
          value={password}
          onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
        />

        <MDBRow className="mb-4">
          <MDBCol className="d-flex justify-content-center">
            <MDBCheckbox id="form2Example3" label="Remember_me" defaultChecked />
          </MDBCol>
          <MDBCol>
            <a href="#!">Forgot password?</a>
          </MDBCol>
        </MDBRow>

        <MDBBtn type="submit" className="mb-4" block>
          Sign in
        </MDBBtn>

        <div className="text-center">
          <p>
            Not a member? <a href="/signup">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}