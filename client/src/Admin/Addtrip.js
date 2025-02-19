import React, { useState } from "react";
import { Button } from "antd";
import ax from "../conf/ax";

// InputField
const InputField = ({ label, type = "text", name, value, onChange, placeholder, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-left mb-2">{label}</label>
    <input
      type={type}
      name={name}
      className="border border-gray-300 p-2 rounded-md w-full"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

// TextareaField
const TextareaField = ({ label, name, value, onChange, placeholder, height = "100px" }) => (
  <div className="mb-4">
    <label className="block text-left mb-2">{label}</label>
    <textarea
      name={name}
      className="border border-gray-300 p-2 rounded-md w-full"
      placeholder={placeholder}
      style={{ height }}
      value={value}
      onChange={onChange}
    />
  </div>
);

// SelectField
const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-left mb-2">{label}</label>
    <select
      name={name}
      className="border border-gray-300 p-2 rounded-md w-full"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// ImageUploader
const ImageUploader = ({ pictures, handleImageUpload, handleDeleteImage }) => (
  <div className="mb-4">
    <label className="block text-left mb-2">ภาพ</label>
    <input
      type="file"
      multiple
      className="border border-gray-300 p-2 rounded-md w-full"
      onChange={handleImageUpload}
    />
    <div className="mt-2">
      {pictures.map((picture, index) => (
        <div key={index} className="flex items-center justify-between border p-2 rounded-md mb-2">
          <img
            src={URL.createObjectURL(picture)}
            alt={`upload-${index}`}
            className="w-32 h-32 object-cover rounded-md"
          />
          <Button type="button" className="bg-red-500 text-white p-1 rounded-md" onClick={() => handleDeleteImage(index)}>
            ลบ
          </Button>
        </div>
      ))}
    </div>
  </div>
);

// SectionTitle
const SectionTitle = ({ title }) => <div className="text-2xl font-bold mb-4">{title}</div>;

function AddTrip() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
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
      // แปลงค่าตัวเลขและวันที่ให้ถูกต้อง
      const formattedData = {
        tour_name: tripData.tripName,
        description: tripData.description,
        price: Number(tripData.price), // แปลงเป็น number
        max_participants: Number(tripData.seats), // แปลงเป็น number
        start_date: new Date(tripData.startDate).toISOString(), // แปลงเป็น ISO 8601
        end_date: new Date(tripData.endDate).toISOString(), // แปลงเป็น ISO 8601
        tour_status: tripData.status,
        destination: tripData.destination,
        tour_type: tripData.typetour, // เปลี่ยน key ให้ถูกต้อง
      };

      const res = await ax.post("/tours", { data: formattedData });
      console.log("โพสต์สำเร็จ:", res.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  const handlecreatetrip = (e) => {
    e.preventDefault();
    maketrip();
  };

  return (
    <form className="bg-white p-8 rounded-lg shadow-lg" style={{ width: '1000px', margin: '0 auto', minHeight: '1000px' }}>
      <div className="text-2xl font-bold mb-4 text-center">Make Tour</div>
      <InputField label="ชื่อทริปต์" name="tripName" value={tripData.tripName} onChange={handleChange} placeholder="ใส่ชื่อทริปต์" />
      <TextareaField label="คำอธิบายทริปต์" name="description" value={tripData.description} onChange={handleChange} placeholder="ใส่คำอธิบายทริปต์" height="200px" />
      <div className="flex space-x-4">
        <div className="w-1/2">
          <InputField label="จำนวนที่นั่ง" type="number" name="seats" value={tripData.seats} onChange={handleChange} placeholder="ใส่จำนวนที่นั่ง" />
        </div>
        <div className="w-1/2">
          <InputField label="ราคาทริปต์" type="number" name="price" value={tripData.price} onChange={handleChange} placeholder="ใส่ราคา" />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <InputField label="วันที่และเวลาเริ่มต้น" type="datetime-local" name="startDate" value={tripData.startDate} onChange={handleChange} />
        </div>
        <div className="w-1/2">
          <InputField label="วันที่และเวลาสิ้นสุด" type="datetime-local" name="endDate" value={tripData.endDate} onChange={handleChange} />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <SelectField label="สถานะ" name="status" value={tripData.status} onChange={handleChange} options={[
            { value: "available", label: "available" },
            { value: "unavailable", label: "unavailable" }
          ]} />
        </div>
        <div className="w-1/2">
          <SelectField label="ประเภททริป" name="typetour" value={tripData.typetour} onChange={handleChange} options={[
            { value: "One Day Trip", label: "One Day Trip" },
            { value: "Package with Accommodation", label: "Package with Accommodation" }
          ]} />
        </div>
      </div>
      <InputField label="จุดหมายปลายทาง" name="destination" value={tripData.destination} onChange={handleChange} placeholder="จุดหมายปลายทาง" />
      <ImageUploader pictures={pictures} handleImageUpload={handleImageUpload} handleDeleteImage={handleDeleteImage} />

      <div className="text-center mt-8">
        <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md" onClick={handlecreatetrip}>
          สร้างทริปต์
        </Button>
      </div>
    </form>
  );
}

export default AddTrip;
