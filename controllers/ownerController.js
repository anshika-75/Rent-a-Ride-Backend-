import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";






//APi to change role of user 
export const changeRoleToOwner  = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" })

    res.json({ success: true, message: "Now you can list your car" })

  } catch (error) {
    console.error(error.message);
    res.json({success:false , message: error.message})
  }
}

//Api to List Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

   
    // Upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
const response = await imagekit.upload({
    file:fileBuffer,
    fileName: imageFile.originalname,
    folder: "/cars",
})
//optimization through imagekit URL transformation

var optimizedImgUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1000" },//width resizing 
        { quality: "auto" },//Auto compression
        { format: "webp" } //COnvert to modern format
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image });
     res.json({ success: true, message: "Car Added" });

  } catch (error) {
    console.log(error.message);
    res.json({success:false ,  message : error.message})
  }
}
