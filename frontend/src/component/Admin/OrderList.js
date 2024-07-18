import React, { Fragment, useEffect, useState } from "react";
import "./productList.css"; // Assuming this file contains your custom styles
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, orders = [] } = useSelector((state) => state.allOrders); // Ensure orders is always an array
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Number of rows per page
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState({ field: "createdAt", order: "desc" });
  const [minQuantity, setMinQuantity] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Filtered orders based on status, item quantity, and amount filters
  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "All" && order.orderStatus !== filterStatus) {
      return false;
    }

    if (minQuantity && order.orderItems.length < parseInt(minQuantity, 10)) {
      return false;
    }

    const totalPrice = parseFloat(order.totalPrice);
    if (
      (minAmount && totalPrice < parseFloat(minAmount)) ||
      (maxAmount && totalPrice > parseFloat(maxAmount))
    ) {
      return false;
    }

    return true;
  });

  // Sort orders based on current sortBy state
  const sortedOrders = filteredOrders.sort((a, b) => {
    const orderA = a[sortBy.field];
    const orderB = b[sortBy.field];

    if (sortBy.order === "asc") {
      return orderA > orderB ? 1 : -1;
    } else {
      return orderA < orderB ? 1 : -1;
    }
  });

  // Paginated orders
  const paginatedOrders = sortedOrders.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0); // Reset page when filter changes
  };

  const handleSortChange = (field) => {
    if (sortBy.field === field) {
      setSortBy({ ...sortBy, order: sortBy.order === "asc" ? "desc" : "asc" });
    } else {
      setSortBy({ field, order: "asc" });
    }
  };

  const handleMinQuantityChange = (event) => {
    setMinQuantity(event.target.value);
    setPage(0); // Reset page when min quantity changes
  };

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
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          {/* Filters */}
          <div className="filtersContainer">
            {/* Status Filter */}
            <FormControl variant="outlined" className="filterControl">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="All" className="menuItem">
                  All
                </MenuItem>
                <MenuItem value="Processing" className="menuItem">
                  Processing
                </MenuItem>
                <MenuItem value="Delivered" className="menuItem">
                  Delivered
                </MenuItem>
                <MenuItem value="Shipped" className="menuItem">
                  Shipped
                </MenuItem>
              </Select>
            </FormControl>

            {/* Min Quantity Filter */}
            <TextField
              label="Min Items"
              type="number"
              value={minQuantity}
              onChange={handleMinQuantityChange}
              variant="outlined"
              className="filterControl"
            />

            {/* Min to Max Amount Filter */}
            <div className="filterControl">
              <TextField
                label="Min Amount"
                type="number"
                value={minAmount}
                onInput={(e) => setMinAmount(e.target.value)}
                variant="outlined"
                className="minAmount"
              />
              <TextField
                label="Max Amount"
                type="number"
                value={maxAmount}
                onInput={(e) => setMaxAmount(e.target.value)}
                variant="outlined"
                className="maxAmount"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="tableContainer">
            {filteredOrders.length === 0 ? (
              <p>No orders found with the current filters.</p>
            ) : (
              <table className="productListTable">
                <thead>
                  <tr>
                    <th>
                      <Button onClick={() => handleSortChange("createdAt")}>
                        Order ID {sortBy.field === "createdAt" && (
                          <span>{sortBy.order === "asc" ? "▲" : "▼"}</span>
                        )}
                      </Button>
                    </th>
                    <th>Status</th>
                    <th>Items Qty</th>
                    <th>
                      <Button onClick={() => handleSortChange("totalPrice")}>
                        Amount {sortBy.field === "totalPrice" && (
                          <span>{sortBy.order === "asc" ? "▲" : "▼"}</span>
                        )}
                      </Button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td
                        className={`statusCell ${
                          order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }`}
                      >
                        {order.orderStatus}
                      </td>
                      <td>{order.orderItems.length}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        <Link to={`/admin/order/${order._id}`}>
                          <EditIcon />
                        </Link>
                        <Button onClick={() => deleteOrderHandler(order._id)}>
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredOrders.length > pageSize && (
            <div className="paginationControls">
              <Button
                variant="contained"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Prev
              </Button>
              <Button
                variant="contained"
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= Math.ceil(filteredOrders.length / pageSize) - 1
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
