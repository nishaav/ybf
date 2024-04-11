// console.log("Welcome");

const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");

const RouterPath=require("./router");

const app=express();
//const port=7000;

const port=7000;
app.use(bodyParser.json());
app.use(cors());
app.use("/",RouterPath);
app.use("/api/user",RouterPath);
app.use("/api/allBlogs",RouterPath);
app.use("/api/allEventBooking",RouterPath);
app.use("/api/allWaitlist",RouterPath);
app.use("/api/state/:id",RouterPath);
app.use("/api/allEvents",RouterPath);
app.use("/api/addEvent",RouterPath);
app.use("/api/adduser",RouterPath);
app.use("/api/login",RouterPath);
app.use("/api/addblog",RouterPath);
app.put('/api/users/:id',RouterPath);
app.delete("/api/deleteBlog/:id",RouterPath);
app.delete("/api/deleteUser/:phoneNo",RouterPath);
app.delete("/api/deleteEvent/:id",RouterPath);
app.listen(port,()=>console.log("Server running on port 7000"));