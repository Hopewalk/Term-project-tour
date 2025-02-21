import React, { useState } from "react";
import { Button, Select } from "antd";
import ax from "../conf/ax";
import Add_Accommodation from "./Component/Add_Accommodation"; 
import {InputField,TextareaField,SelectField,ImageUploader,SectionTitle,} from "./Component/Tagcomponent";

function AddTrip() {
  const [activeTab, setActiveTab] = useState("makeTour");

  const [tripData, setTripData] = useState({
    tripName: "",
    description: "",
    seats: "",
    price: "",
    startDate: "",
    endDate: "",
    status: "available",
    destination: "",
    typetour: "One Day Trip",
  });
  const [pictures, setPictures] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // ลบข้อความผิดพลาดเมื่อกรอกข้อมูล
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPictures([...pictures, ...files]);
  };

  const handleDeleteImage = (index) => {
    setPictures(pictures.filter((_, i) => i !== index));
  };

  const maketrip = async () => {
    try {
      const res = await ax.post("/tours", {
        data: {
          tour_name: tripData.tripName,
          description: tripData.description,
          price: Number(tripData.price),
          max_participants: Number(tripData.seats),
          start_date: new Date(tripData.startDate).toISOString(),
          end_date: new Date(tripData.endDate).toISOString(),
          tour_status: tripData.status,
          destination: tripData.destination,
          tour_type: tripData.typetour,
        },
      });
      console.log("โพสต์สำเร็จ:", res.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      pictures.forEach((file) => {
        console.log("Uploading file:", file.name, file.type);
        formData.append("files", file);
      });

      const res = await ax.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("อัพโหลดสำเร็จ:", res.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  const handlecreatetrip = (e) => {
    e.preventDefault();
    const newErrors = {};

    // ตรวจสอบว่าที่จำเป็นทั้งหมดถูกกรอก
    if (!tripData.tripName) newErrors.tripName = "กรุณากรอกชื่อทริปต์";
    if (!tripData.description)
      newErrors.description = "กรุณากรอกคำอธิบายทริปต์";
    if (!tripData.seats) newErrors.seats = "กรุณากรอกจำนวนที่นั่ง";
    if (!tripData.price) newErrors.price = "กรุณากรอกราคา";
    if (!tripData.startDate)
      newErrors.startDate = "กรุณากรอกวันที่เริ่มต้น";
    if (!tripData.endDate)
      newErrors.endDate = "กรุณากรอกวันที่สิ้นสุด";
    if (!tripData.destination)
      newErrors.destination = "กรุณากรอกจุดหมายปลายทาง";

    // ตรวจสอบว่าถึงวันที่เริ่มต้นมากกว่าหรือเท่ากับวันที่สิ้นสุด
    if (new Date(tripData.startDate) >= new Date(tripData.endDate)) {
      newErrors.startDate = "วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด!";
      newErrors.endDate = "วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      maketrip();
      uploadImage();
    }
  };

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg"
      style={{ width: "1000px", margin: "0 auto", minHeight: "1000px" }}
    >
      {/* Dropdown สำหรับสลับระหว่าง Make Tour และ เพิ่มที่พัก */}
      <div className="text-center mb-4">
        <Select
          value={activeTab}
          onChange={(value) => setActiveTab(value)}
          style={{ width: 200 }}
        >
          <Select.Option value="makeTour">Make Tour</Select.Option>
          <Select.Option value="addAccommodation">
            เพิ่มที่พัก
          </Select.Option>
        </Select>
      </div>

      {activeTab === "makeTour" ? (
        <form onSubmit={handlecreatetrip}>
          <div className="text-2xl font-bold mb-4 text-center">
            Make Tour
          </div>
          <InputField
            label="ชื่อทริปต์"
            name="tripName"
            value={tripData.tripName}
            onChange={handleChange}
            placeholder="ใส่ชื่อทริปต์"
            required
            error={errors.tripName}
          />
          <TextareaField
            label="คำอธิบายทริปต์"
            name="description"
            value={tripData.description}
            onChange={handleChange}
            placeholder="ใส่คำอธิบายทริปต์"
            height="200px"
            required
            error={errors.description}
          />
          <div className="flex space-x-4">
            <div className="w-1/2">
              <InputField
                label="จำนวนที่นั่ง"
                type="number"
                name="seats"
                value={tripData.seats}
                onChange={handleChange}
                placeholder="ใส่จำนวนที่นั่ง"
                required
                error={errors.seats}
              />
            </div>
            <div className="w-1/2">
              <InputField
                label="ราคาทริปต์"
                type="number"
                name="price"
                value={tripData.price}
                onChange={handleChange}
                placeholder="ใส่ราคา"
                required
                error={errors.price}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <InputField
                label="วันที่และเวลาเริ่มต้น"
                type="datetime-local"
                name="startDate"
                value={tripData.startDate}
                onChange={handleChange}
                required
                error={errors.startDate}
              />
            </div>
            <div className="w-1/2">
              <InputField
                label="วันที่และเวลาสิ้นสุด"
                type="datetime-local"
                name="endDate"
                value={tripData.endDate}
                onChange={handleChange}
                required
                error={errors.endDate}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <SelectField
                label="สถานะ"
                name="status"
                value={tripData.status}
                onChange={handleChange}
                options={[
                  { value: "available", label: "available" },
                  { value: "unavailable", label: "unavailable" },
                ]}
              />
            </div>

            <div className="w-1/2">
              <SelectField
                label="ประเภททริป"
                name="typetour"
                value={tripData.typetour}
                onChange={handleChange}
                options={[
                  { value: "One Day Trip", label: "One Day Trip" },
                  {
                    value: "Package with Accommodation",
                    label: "Package with Accommodation",
                  },
                ]}
              />
            </div>
          </div>

          <InputField
            label="จุดหมายปลายทาง"
            name="destination"
            value={tripData.destination}
            onChange={handleChange}
            placeholder="จุดหมายปลายทาง"
            required
            error={errors.destination}
          />
          <ImageUploader
            pictures={pictures}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
          />

          <div className="text-center mt-8">
            <Button
              htmlType="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              สร้างทริปต์
            </Button>
          </div>
        </form>
      ) : (
        // แสดงส่วนของการเพิ่มที่พัก เมื่อเลือก tab "เพิ่มที่พัก"
        <Add_Accommodation />
      )}
    </div>
  );
}

export default AddTrip;
