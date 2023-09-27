import { useState } from "react";
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

export default function Signup() {
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const { firstname, lastname, email, password } = userInfo;
  
  const navigate = useNavigate();

  // signup data submission
  const handleFormData = async (event) => {
    try {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Check if any required form fields are missing
      if (!firstname || !lastname || !email || !password) {
        toast.error("Please fill the form");
      } else if (password.length < 6) {
        toast.error("Password should contain at least 8 letters!");
      } else {
        // All required form fields are present, so proceed with form submission
        const formData = {
          firstname,
          lastname,
          email,
          password,
        };
        dispatch(showLoading())
        const response = await axios.post("/api/user/signup", formData);
        dispatch(hideLoading())
        if (response.data.success) {
          // If the response indicates success, show a success toast and navigate to "/login"
          toast.success(response.data.message);
          // Navigate to the login page (adjust this part based on your application)
          navigate("/");
        } else {
          // If the response indicates failure, show an error toast with the message from the server
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
        <MDBRow className="mb-4">
          <MDBCol>
            <MDBInput
              id="form3Example1"
              label="First name"
              value={firstname}
              onChange={(e) => setUserInfo({ ...userInfo, firstname: e.target.value })}
            />
          </MDBCol>
          <MDBCol>
            <MDBInput
              id="form3Example2"
              label="Last name"
              value={lastname}
              onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })}
            />
          </MDBCol>
        </MDBRow>
        <MDBInput
          className="mb-4"
          type="email"
          id="form3Example3"
          label="Email address"
          value={email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value.toLowerCase() })}
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="form3Example4"
          label="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
        />

        <MDBCheckbox
          wrapperClass="d-flex justify-content-center mb-4"
          id="form3Example5"
          label="Subscribe to our newsletter"
          defaultChecked
        />

        <MDBBtn type="submit" className="mb-4" block>
          Sign up
        </MDBBtn>

        <div className="text-center">
          <p className="py-1">
            Already Have an Account ? <a href="/">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}
