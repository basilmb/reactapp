import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [deleteUser]);

  const getData = async () => {
    try {
      const response = await axios.post(
        "/api/admin/get-user-info",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );
      const { userDetails, status } = response.data;
      if (status === false) navigate("/login");
      else if (userDetails) {
        setUserData(userDetails);
        setFilteredData(userDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value);

    setDeleteUser(false);

    const updatedData = userData.filter((item) =>
      item.firstname.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredData(updatedData);
  };

  const editUser = (userId, firstname, lastname, email, phone) => {
    navigate("/admin/editUser", {
      state: { _id: userId, firstname, lastname, email, phone },
    });
  };

  const DeleteUser = async (userId) => {
    const response = await axios.post(
      `/api/admin/deleteUser/${userId}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("adminToken"),
        },
      }
    );
    if (response.data.success) {
      setDeleteUser(!deleteUser);
      toast.success("Deleted successfuy!");
    } else {
      toast.error(response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="table-wrapper">
      <div className="table">
        <div className="search2">
          <h2 className="heading">USER DATA</h2>

          <input
            className=""
            type="text"
            placeholder="Search here"
            onChange={handleChange}
            value={search}
          />

          <span onClick={logout}> Logout </span>
        </div>

        <Table className="mt-3 " bordered>
          <thead style={{ color: "black" }}>
            <tr>
              <th>Sl.no</th>
              <th>Name</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete </th>
            </tr>
          </thead>
          <tbody className="values " style={{ color: "black" }}>
            {filteredData.map((obj, index) => {
              return (
                <tr key={obj._id}>
                  <td style={{ color: "black" }}>{index + 1}</td>
                  <td>
                    {obj.firstname} {obj.lastname}
                  </td>
                  <td>{obj.email}</td>
                  <td>
                    <Button
                      className="edit-btn"
                      onClick={() =>
                        editUser(
                          obj._id,
                          obj.firstname,
                          obj.lastname,
                          obj.email,
                          obj.phone
                        )
                      }
                      variant="primary"
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="delete-btn"
                      onClick={() => DeleteUser(obj._id)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Dashboard;
