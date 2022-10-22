import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
import Post from "./models/Post.js";
import Note from "./models/Note.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/blogs", async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
  });
  await post.save();
});

app.post("/api/notes", async (req, res) => {
  const subject = req.body.subject;
  const topic = req.body.topic;
  const url = req.body.url;
  const note = new Note({
    subject: subject,
    topic: topic,
    url: url,
  });
  await note.save();
});

app.get("/api/notes", (req, res) => {
  Note.find({}, (err, notes) => {
    if (err) {
      res.send(err);
    } else {
      res.send(notes);
    }
  });
});

app.get("/api/blogs", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.send(err);
    } else {
      res.send(posts);
    }
  });
});

app.get("/api/blogs/:id", (req, res) => {
  let id = req.params.id;
  Post.findOne({ _id: id }, (err, foundpost) => {
    if (err) {
      res.send(err);
    } else {
      res.send(foundpost);
    }
  });
});

app.get("/api/blogs/del/:id", (req, res) => {
  let id = req.params.id;
  Post.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      console.log(docs);
    }
  });
});

app.get("/api/notes/del/:id", (req, res) => {
  let id = req.params.id;
  Note.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      console.log(docs);
    }
  });
});

app.patch("/api/blogs/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndUpdate(id, req.body, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

app.patch("/api/notes/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Note.findByIdAndUpdate(id, req.body, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const pwd = req.body.pwd;

  if (
    email === process.env.REACT_APP_ADMIN_EMAIL &&
    pwd === process.env.REACT_APP_ADMIN_PASSWORD
  ) {
    jwt.sign(
      { email, pwd },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        res.send(token);
      }
    );
  } else {
    res.send("false");
  }
});

app.post("/api/verify", (req, res) => {
  const token = req.body.token;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      //If token is successfully verified, we can send the autorized data
      res.json({
        message: "success",
        authorizedData,
      });
      console.log("SUCCESS: Connected to protected route");
    }
  });
});

let port = process.env.PORT || 3002;
const start = () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
