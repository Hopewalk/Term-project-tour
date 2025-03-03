import React, { useState } from "react";
import { Button } from "antd";
import ax from "../../conf/ax";
import { useNotification, NotificationContainer } from './notification';

import { InputField, TextareaField, SelectField, ImageUploader, } from "./Tagcomponent";

function AddAccommodation() {
    const [errors, setErrors] = useState({});
    const { notifications, removeNotification, showSuccess, showError, showWarning } = useNotification();
    const [AccommodationData, setAccommodationData] = useState({
        accommodationName: "",
        description: "",
        location: "",
        price: "",
        rating: "",
        context: "",
    });

    const handlereset = () => {
        setAccommodationData({
            accommodationName: "",
            description: "",
            location: "",
            price: "",
            rating: "",
            context: "",
            });
        };

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
            showSuccess("Create AccommodationData success")
            return res.data;
        } catch (err) {
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            showError('เกิดข้อผิดพลาด: ' + err.message)
            throw err;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccommodationData((prev) => ({
            ...prev,
            [name]: value
        }));
    
        // ลบข้อความ error เมื่อกรอกข้อมูลใหม่
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value ? "" : prevErrors[name],
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
        if (!AccommodationData.accommodationName) newErrors.accommodationName = "กรุณากรอกชื่อที่พัก";
        if (!AccommodationData.description) newErrors.description = "กรุณากรอกรายละเอียด";
        if (!AccommodationData.location) newErrors.location = "กรุณากรอกที่อยู่";
        if (!AccommodationData.price) newErrors.price = "กรุณากรอกราคา";
        if (!AccommodationData.rating) newErrors.rating = "กรุณาให้คะแนนที่พัก";
        if (!AccommodationData.context) newErrors.context = "กรุณากรอกข้อมูลติดต่อ";
    
        if (Object.keys(newErrors).length > 0) {
            showWarning("กรุณากรอกข้อมูลให้ครบถ้วน")
            setErrors(newErrors);
            return;
        }
    
        try {
            const result = await makeAccommodation();
            console.log("Success:", result);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };
    
    return (
        <div >
            <div className="text-2xl font-bold mb-4 text-center">Create Accommodation</div>
                <InputField
                    label="Accommodation Name"
                    name="accommodationName"
                    type="text"
                    placeholder="กรอกชื่อที่พัก"
                    value={AccommodationData.accommodationName}
                    onChange={handleChange}
                    error={errors.accommodationName}
                    />
                <TextareaField
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="กรอกคำอธิบาย"
                    value={AccommodationData.description}
                    onChange={handleChange}
                    error={errors.description}
                />
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <InputField
                            label="Location"
                            name="location"
                            type="text"
                            placeholder="กรอกที่อยู่"
                            value={AccommodationData.location}
                            onChange={handleChange}
                            error={errors.location}

                        />
                    </div>
                    <div className="w-1/2">
                        <InputField
                            label="Price"
                            name="price"
                            type="number"
                            placeholder="กรอกราคา"
                            value={AccommodationData.price}
                            onChange={handleChange}
                            error={errors.price}
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
                            error={errors.rating}
                            min={1}
                            max={5}
                            step={0.1}                       
                        />
                    </div>

                    <div className="w-1/2">
                        <InputField
                            label="Context info"
                            name="context"
                            type="text"
                            placeholder="กรอกข้อมูลติดต่อ"
                            value={AccommodationData.context}
                            onChange={handleChange}
                            error={errors.context}
                        />
                    </div>
                </div >
                <div className="flex justify-end space-x-4 mt-4">
                <div className="text-right mt-8">
                    <Button
                    onClick={handlereset}
                    className="bg-yellow-500 text-white p-2 rounded-md"
                    >
                    Reset data field
                    </Button>
                </div>
                <div className="text-right mt-8">
                    <Button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white p-2 rounded-md"
                    >
                    submit
                    </Button>
                </div>
                </div>
                <div>
                    <NotificationContainer 
                    notifications={notifications}
                    removeNotification={removeNotification}
                    />
                </div>
        </div>
    );
}

export default AddAccommodation;