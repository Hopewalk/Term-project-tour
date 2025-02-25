import React, { useState, useEffect } from "react";
import { Tabs, Button, Select, notification } from 'antd';
import ax from "../conf/ax";
import Add_Accommodation from "./Component/ADD_Accommodation"; 
import {
  InputField,
  TextareaField,
  SelectField,
  ImageUploader,
} from "./Component/Tagcomponent";

function AddTrip() {
  const [activeTab, setActiveTab] = useState("Create Tour");
  const [pictures, setPictures] = useState([]);
  const [errors, setErrors] = useState({});
  const [accommodations, setAccommodations] = useState([]);
  const [tripData, setTripData] = useState({
    tripName: "",
    description: "",
    seats: "",
    price: "",
    startDate: "",
    endDate: "",
    status: "unavailable",
    destination: "",
    typetour: "One Day Trip",
    accommodation: "", // ค่านี้จะเก็บ id ของ accommodation ที่เลือก
  });

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

  const handlereset = () => {
    setTripData({
      tripName: "",
      description: "",
      seats: "",
      price: "",
      startDate: "",
      endDate: "",
      status: "unavailable",
      destination: "",
      typetour: "One Day Trip",
      accommodation: "",
    });
    setPictures([]);
  };

  // ฟังก์ชันสำหรับอัปโหลดไฟล์และคืนค่า response (ซึ่งควรมี id ของไฟล์)
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
      return res.data; // คาดว่า res.data เป็น array ของ object ที่มี property id
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      return null;
    }
  };

  // ฟังก์ชันสำหรับสร้างทัวร์โดยรับ parameter เป็นข้อมูลไฟล์ที่อัปโหลดแล้ว
  const maketrip = async (uploadedFiles) => {
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
          image: uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles[0].id : null,
          accommodations: {
            connect: tripData.accommodation ? [{ id: tripData.accommodation }] : []
          }
        },
      });

      console.log("โพสต์สำเร็จ:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      throw err;
    }
  };

  const fetchAccommodations = async () => {
    try {
      const res = await ax.get("/accommodations");
      console.log("Accommodations fetched:", res.data);
      if (res.data && res.data.data) {
        setAccommodations(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching accommodations:", err);
    }
  };

  // handlecreatetrip ต้องเป็น async เพื่อรอผลลัพธ์จาก uploadImage ก่อนที่จะเรียก maketrip
  const handlecreatetrip = async (e) => {
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

    // ตรวจสอบการกรอกข้อมูลฝั่ง ที่พัก

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let uploadedFiles = null;
      if (pictures.length > 0) {
        uploadedFiles = await uploadImage();
      }
      maketrip(uploadedFiles);
    }
  };

  useEffect(() => {
    fetchAccommodations();
    setActiveTab("Create Tour");
  }, []);

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg"
      style={{ width: "1000px", margin: "0 auto", minHeight: "1000px" }}
    >
      {/* Tabs สำหรับสลับระหว่าง Make Tour และ เพิ่มที่พัก */}
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <Tabs.TabPane tab="Creat Tour" key="Create Tour">
          <form onSubmit={handlecreatetrip}>
            <div className="text-2xl font-bold mb-4 text-center">
            Creat Tour
            </div>
            <InputField
              label="Tour Name"
              name="Tour Name"
              value={tripData.tripName}
              onChange={handleChange}
              placeholder="ใส่ชื่อทริปต์"
              error={errors.tripName}
            />
            <TextareaField
              label="Description"
              name="description"
              value={tripData.description}
              onChange={handleChange}
              placeholder="ใส่คำอธิบายทริปต์"
              height="200px"
              error={errors.description}
            />
            <div className="flex space-x-4">
              <div className="w-1/2">
                <InputField
                  label="Seats"
                  type="number"
                  name="seats"
                  value={tripData.seats}
                  onChange={handleChange}
                  placeholder="ใส่จำนวนที่นั่ง"
                  error={errors.seats}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  label="Price"
                  type="number"
                  name="price"
                  value={tripData.price}
                  onChange={handleChange}
                  placeholder="ใส่ราคา"
                  error={errors.price}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <InputField
                  label="Start Date"
                  type="datetime-local"
                  name="startDate"
                  value={tripData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  label="End Date"
                  type="datetime-local"
                  name="endDate"
                  value={tripData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <SelectField
                  label="Status"
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
                  label="tour type"
                  name="tour type"
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
            <div className="flex space-x-4">
              <div className="w-1/2">
                <InputField
                  label="Destination"
                  name="destination"
                  value={tripData.destination}
                  onChange={handleChange}
                  placeholder="จุดหมายปลายทาง"
                  error={errors.destination}
                />
              </div>
              <div className="w-1/2">
                <SelectField
                  label="Accommodation"
                  value={tripData.accommodation}
                  options={accommodations.map((accommodation) => ({
                    value: accommodation.id,
                    label: accommodation.name,
                  }))}
                  name="accommodation"
                  onChange={handleChange}
                />
              </div>
            </div>

            <ImageUploader
              pictures={pictures}
              handleImageUpload={handleImageUpload}
              handleDeleteImage={handleDeleteImage}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <div className="text-right mt-8">
                <Button
                  onClick={handlereset}
                  className="bg-yellow-500 text-white p-2 rounded-md"
                >
                  Reset fill
                </Button>
              </div>
              <div className="text-right mt-8">
                <Button
                  htmlType="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  submit
                </Button>
              </div>
            </div>
          </form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Create Accommodation" key="Create Accommodation">
          <Add_Accommodation />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default AddTrip;
