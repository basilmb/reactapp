import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertSlice"

export default function Profile() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(
    "https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg"
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(
        "/api/user/get-user-info",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const { success, data } = response.data;

      if (success) {
        setUser(data);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      dispatch(showLoading());
      const response = await axios.post("/api/user/addUserImage", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(hideLoading());

      const imageURLFromServer = response.data.image;
      setImageURL(imageURLFromServer);
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };
  return (
    <div className="vh-100" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="4">
            <MDBCard style={{ borderRadius: "15px" }}>
              <MDBCardBody className="text-center">
                <div className="mt-3 mb-4">
                  <MDBCardImage
                    src={imageURL}
                    className="rounded-circle"
                    fluid
                    style={{ width: "150px" }}
                  />
                </div>
                <MDBTypography tag="h4">{user.name}</MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  <a href="#!">{user.email}</a>
                </MDBCardText>
                <div className="mb-4 pb-2">
                  <MDBBtn outline floating>
                    <MDBIcon fab icon="facebook" size="lg" />
                  </MDBBtn>
                  <MDBBtn outline floating className="mx-1">
                    <MDBIcon fab icon="twitter" size="lg" />
                  </MDBBtn>
                  <MDBBtn outline floating>
                    <MDBIcon fab icon="skype" size="lg" />
                  </MDBBtn>
                </div>
                <div>
                  <label className="custom-file-upload">
                    <input type="file" onChange={handleFileChange} />
                    Choose file
                  </label>
                </div>
                <MDBBtn
                  rounded
                  size="lg"
                  className="mb-4"
                  onClick={handleUpload}
                >
                  Add image
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
