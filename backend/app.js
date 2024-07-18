const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/error");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({ path: "backend/config/config.env" });

}
// Increase the payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    // res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
})

// Middleware for Error
app.use(errorMiddleware);


module.exports = app;



// EMAIL_SENDER = kishorekumar8273@gmail.com

// SMTP_MAIL = jannie58@ethereal.email

// SMTP_PASSWORD = 4Q4DgjSBg1HwREHaSn

// SMTP_HOST = smtp.ethereal.email

// SMTP_PORT = 587

// CLOUDINARY_NAME = dcee1h9mq

// CLOUDINARY_API_KEY = 241559156539496

// CLOUDINARY_API_SECRET = p4D9ItYjc9ucVJLNbvSM4JXVPH4

// STRIPE_API_KEY = pk_test_51PRvWSSA3GdxVw3t8k0VtO6Fgpbi0PTu9xyTJ0GzRjmyoWUR2A6T2qoFUjaEu6QF5owPVRxMkeWO35sr8drYlB8q00cnRxBUj7

// STRIPE_SECRET_KEY = sk_test_51PRvWSSA3GdxVw3t7uxPEfSr06KFd16hjwgjqNT9tVhja4cJnss5YgoouxmvYnoqTpKu07owH07WNEdFrWzFWLsb003Fz68r17
// PORT = 4000 
// DB_URI = "mongodb+srv://yogeshchouhan074358:V2zx7FQJpzcXNkNe@ecommerce.pbecgev.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Ecommerce"

// JWT_SECRET = ghdksfdkgkhfsdf565eq4KHJHDFAVKJLJjkhdfd658
// JWT_EXPIRE = 5d
// COOKIE_EXPIRE= 5

// NODE_ENV = PRODUCTION