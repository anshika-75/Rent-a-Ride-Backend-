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

var optimizedImageUrl = imagekit.url({
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

//Api to List Owner Cars

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error changing role:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while changing the role.",
      error: error.message,
    });
  }
};

//API to toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);
//Checking is car belongs to the user

    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability toggled" });
  } 
  catch (error) {
    console.error("Error changing role:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while changing the role.",
      error: error.message,
    });
  }
};

//API to delete a CAR

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    //checking is car belongs to the user
    if (car.owner.toString() !== _id.toString())
      return res.json({ success: false, message: "Unauthorized" });

    car.owner = null;
    car.isAvailable = false;

    await car.save();
res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    console.error("Error changing role:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while changing the role.",
      error: error.message,
    });
  }
};

//Api to get Dashboard Data..
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner")
      return res.json({ success: false, message: "Unauthorized" });
    const cars = await Car.find({ owner: _id });
    
  } catch (error) {
    console.error("Error changing role:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while changing the role.",
      error: error.message,
    });
  }
};
