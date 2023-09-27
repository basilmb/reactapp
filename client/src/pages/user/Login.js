import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice"

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
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;
  const navigate = useNavigate();

  const handleFormData = async (event) => {
    try {
      event.preventDefault();

      if (!email || !password) {
        toast.error("Please fill the form");
      } else if (password.length < 6) {
        toast.error("Password should contain at least 6 characters!");
      } else {
        const formData = {
          email,
          password,
        };
        dispatch(showLoading())
        const response = await axios.post("/api/user/login", formData);
        dispatch(hideLoading())
        if (response.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("token", response.data.data);
          navigate("/");
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
          type="email"
          id="form2Example1"
          label="Email address"
          value={email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value.toLowerCase() })}
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="form2Example2"
          label="Password"
          value={password}
          onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
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
