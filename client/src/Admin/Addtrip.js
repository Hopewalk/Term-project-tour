import React, { useState, useEffect } from "react";
import axios from "axios";

function AddTrip() {
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState("");
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [category_name, setCategory_name] = useState("");
  const [category_description, setCategory_description] = useState("");

  const maketrip = async () => {
    try {
      const res = await axios.post("/api/tours", {
        tour_name: tripName,
        description: description,
        price: price, 
        product_id: productId,
        start_date: startDate,
        end_date: endDate,
        tour_status: status,
        tour_category: {
          category_name: category_name,
          description: category_description,
        },
      });
      console.log("โพสต์สำเร็จ:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlecreatetrip = (e) => {
    e.preventDefault();
    maketrip();
  };

  return (
    <form onSubmit={handlecreatetrip}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg" style={{ width: '1000px', height: '1200px' }}>
          <h1 className="text-2xl font-bold mb-4 text-center">สร้างทริปต์</h1>

          {/* Trip name */}
          <div className="mb-4">
            <label className="block text-left mb-2">ชื่อทริปต์</label>
            <input 
              type="text" 
              className="border border-gray-300 p-2 rounded-md w-full" 
              placeholder="ใส่ชื่อทริปต์" 
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          {/* Trip description */}
          <div className="mb-4">
            <label className="block text-left mb-2">คำอธิบายทริปต์</label>
            <textarea 
              className="border border-gray-300 p-2 rounded-md w-full" 
              placeholder="ใส่คำอธิบายทริปต์" 
              style={{ height: '200px' }} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* จำนวนและรหัสสินค้า */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-left mb-2">จำนวนที่นั่ง</label>
              <input 
                type="text" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                placeholder="ใส่จำนวนที่นั่ง" 
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-left mb-2">รหัสสินค้า</label>
              <input 
                type="text" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                placeholder="ใส่รหัสสินค้า" 
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          </div>

          {/* ราคา */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-left mb-2">ราคาทริปต์</label>
              <input 
                type="text" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                placeholder="ใส่ราคา" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-left mb-2">จำนวนผู้เข้าร่วม</label>
              <input 
                type="text" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                placeholder="ใส่จำนวนผู้เข้าร่วม" 
              />
            </div>
          </div>

          {/* วันที่และเวลา */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-left mb-2">วันที่และเวลาเริ่มต้น</label>
              <input 
                type="datetime-local" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-left mb-2">วันที่และเวลาสิ้นสุด</label>
              <input 
                type="datetime-local" 
                className="border border-gray-300 p-2 rounded-md w-full"  
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* สถานะ */}
          <div className="mb-4">
            <label className="block text-left mb-2">สถานะ</label>
            <select 
              className="border border-gray-300 p-2 rounded-md w-full" 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">available</option>
              <option value="close">unavailable</option>
            </select>
          </div>  

          {/* Category name */}
          <div className="mb-4">
            <label className="block text-left mb-2">ชื่อหมวดหมู่</label>
            <input 
              type="text" 
              className="border border-gray-300 p-2 rounded-md w-full" 
              placeholder="ใส่ชื่อหมวดหมู่" 
              value={category_name}
              onChange={(e) => setCategory_name(e.target.value)}
            />
          </div>

          {/* Category description */}
          <div className="mb-4">
            <label className="block text-left mb-2">คำอธิบายหมวดหมู่</label>
            <textarea 
              className="border border-gray-300 p-2 rounded-md w-full" 
              placeholder="ใส่คำอธิบายหมวดหมู่" 
              style={{ height: '100px' }} 
              value={category_description}
              onChange={(e) => setCategory_description(e.target.value)}
            />
          </div>
          
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">สร้างทริปต์</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddTrip;