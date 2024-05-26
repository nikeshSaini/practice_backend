import mongoose from "mongoose";

async function mongodbConnection(url) {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }
}

export{mongodbConnection};