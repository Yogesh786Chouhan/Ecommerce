import React, { Fragment, useEffect, useState } from "react";
import "./userList.css"; 
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  Button,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
  Paper,
  TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const UsersList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      user.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
      user.role.toLowerCase().includes(roleFilter.toLowerCase())
    );
  });

  const renderUserRows = () => {
    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
      <TableRow key={user._id}>
        <TableCell>{user._id}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell className={user.role === "admin" ? "greenColor" : "redColor"}>
          {user.role}
        </TableCell>
        <TableCell>
          <Link to={`/admin/user/${user._id}`}>
            <EditIcon />
          </Link>
          <Button onClick={() => deleteUserHandler(user._id)}>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="userListContainer">
          <h1 id="userListHeading">ALL USERS</h1>

          <div className="filters">
            <TextField
              label="Filter by Name"
              variant="outlined"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ margin: "10px" }}
            />
            <TextField
              label="Filter by Email"
              variant="outlined"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              style={{ margin: "10px" }}
            />
            <TextField
              label="Filter by Role"
              variant="outlined"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ margin: "10px" }}
            />
          </div>

          <Paper>
            <TableContainer>
              <Table className="userListTable" aria-label="Users table">
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    renderUserRows()
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              labelRowsPerPage="Users per page:"
            />
          </Paper>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
