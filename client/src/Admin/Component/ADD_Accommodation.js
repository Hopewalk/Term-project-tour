import React, { useState } from "react";
import { Button } from "antd";
import ax from "../../conf/ax";
import { InputField, TextareaField, SelectField, ImageUploader, SectionTitle } from "./Tagcomponent";

function Add_Accommodation() {
    const [AccommodationData, setAccommodationData] = useState({
        accommodationName: "",
        description: "",
        location: "",
        price: "",
        rating: "",
        context: "",
    });

    const makeAccommodation = async () => {
        try {
            const res = await ax.post("/accommodations", {
            data: {
                name: AccommodationData.accommodationName,
                description: AccommodationData.description,
                location: AccommodationData.location,
                price: Number(AccommodationData.price),
                rating: Number(AccommodationData.rating),
                contact_info: AccommodationData.context 
            }});
            console.log("Response:", res.data);
            
            return res.data;
        } catch (err) {
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            throw err;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccommodationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        //ตรวจสอบว่าส่งข้อมูลสำเร็จหรือไม่
        e.preventDefault();
        try {
            const result = await makeAccommodation();
            console.log("Success:", result);
        } catch (error) {
            console.error("Submit error:", error);
            alert("เกิดข้อผิดพลาดในการเพิ่มที่พัก: " + 
                (error.response?.data?.error?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <SectionTitle title="เพิ่มที่พัก" className="text-2xl font-bold mb-4 flex justify-center mt-4"/>
                <InputField
                    label="ชื่อที่พัก"
                    name="accommodationName"
                    type="text"
                    placeholder="กรอกชื่อที่พัก"
                    value={AccommodationData.accommodationName}
                    onChange={handleChange}
                />
                <TextareaField
                    label="รายละเอียด"
                    name="description"
                    type="text"
                    placeholder="กรอกคำอธิบาย"
                    value={AccommodationData.description}
                    onChange={handleChange}
                />
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <InputField
                            label="ที่อยู่"
                            name="location"
                            type="text"
                            placeholder="กรอกที่อยู่"
                            value={AccommodationData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <InputField
                            label="ราคา"
                            name="price"
                            type="number"
                            placeholder="กรอกราคา"
                            value={AccommodationData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <InputField
                            label="Rating"
                            name="rating"
                            type="number"
                            placeholder="ให้คะแนนความนิยม"
                            value={AccommodationData.rating}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <InputField
                            label="context info"
                            name="context"
                            type="text"
                            placeholder="กรอกข้อมูลติดต่อ"
                            value={AccommodationData.context}
                            onChange={handleChange}
                        />
                    </div>
                </div >
                <div className="flex justify-center mt-4">
                <Button type="submit" 
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white p-2 rounded-md mt-4"
                >
                    เพิ่มที่พัก
                </Button>
                </div>
        </div>
    );
}

export default Add_Accommodation;