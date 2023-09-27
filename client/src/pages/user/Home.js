import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBContainer,
  MDBNavbar,
  MDBInputGroup,
  MDBIcon,
  MDBInput,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge,
} from "mdb-react-ui-kit";

export default function Home() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});

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
      const { userDetails, status } = response.data;
      if (status === false) navigate("/");
      else if (userDetails) setUserDetails(userDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUserDetails(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header>
      {/* Main Navigation */}
      <MDBNavbar expand="lg" light className="bg-white">
        {/* Container wrapper */}
        <MDBContainer fluid>
          {/* Search form */}
          <MDBInputGroup textAfter={<MDBIcon fas icon="search" />} noBorder>
            {/* <MDBInput
              autoComplete="off"
              className="active"
              type="search"
              placeholder='Search (ctrl + "/" to focus)'
              style={{ minWidth: "225px" }}
            /> */}
          </MDBInputGroup>

          {/* Right links */}
          <MDBNavbarNav className="d-flex flex-row" right fullWidth={false}>
            {/* Notification dropdown */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle
                  tag="a"
                  className="hidden-arrow me-3 me-lg-0 nav-link"
                  style={{ cursor: "pointer" }}
                >
                  <MDBIcon fas icon="bell" />
                  <MDBBadge pill notification color="danger">
                    1
                  </MDBBadge>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Some news</MDBDropdownItem>
                  <MDBDropdownItem link>Another news</MDBDropdownItem>
                  <MDBDropdownItem link>Something else</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Avatar */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle
                  tag="a"
                  className="hidden-arrow d-flex align-items-center nav-link"
                >
                  <img
                    src="https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-image-700-205124837.jpg"
                    className="rounded-circle"
                    height="22"
                    alt="Avatar"
                    loading="lazy"
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={goToProfile}>MyProfile</MDBDropdownItem>
                  <MDBDropdownItem link>Settings</MDBDropdownItem>
                  <MDBDropdownItem link onClick={logout}>Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>

      {/* Heading */}
      <div className="p-5 mb-4">
        <h1>Welcome To Home</h1>
        {/* Breadcrumb */}
      </div>
    </header>
  );
}
