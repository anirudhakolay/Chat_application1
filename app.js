const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const socket = require("socket.io");
const app = express();
const path = require('path');


const LoginRouter = require("./routers/loginRouter");
const RegisterRouter = require("./routers/registerRouter");
const chatRouter = require("./routers/chatRouter");
const Logout = require("./routers/logoutRouter");

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://anirudha_kolay:admin@cluster0.8b2pbcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    useNewUrlParser:true,
}).then(()=>{
    console.log("Connection Successfully");
}).catch((e)=>{
    console.log("No connection");
})
app.engine('ejs', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "ChatV2", resave: false, saveUninitialized: true }));

const io = socket(app.listen(3000));

io.on("connection", (socket) => {
  console.log(socket.id + " a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });
});

app.use(LoginRouter);
app.use(RegisterRouter);
app.use(chatRouter);
app.use(Logout);

app.use(function (req, res) {
  res.status(404).end("404 NOT FOUND");
});
