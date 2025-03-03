import React, { useState, useEffect } from "react";
import { Button } from "antd";
import ax from "../../conf/ax";
import { useNotification, NotificationContainer } from "./notification";
import {
    InputField,
    TextareaField,
    SelectField,
    ImageUploader,
} from "./Tagcomponent";
import ReactSelect from "react-select";

function AddTour() {
    const [pictures, setPictures] = useState([]);
    const [errors, setErrors] = useState({});
    const [accommodations, setAccommodations] = useState([]);
    const [categorys,setCategory] = useState([]);
    const [regions, setRegion] = useState([]);
    const { notifications, removeNotification, showWarning, showSuccess, showError } =
        useNotification();

    // สถานะข้อมูลทัวร์
    const [tripData, setTripData] = useState({
        tripName: "",
        description: "",
        price: "",
        status: "",
        destination: "",
        typetour: "",
        accommodation: [], // array รองรับ multi-select ที่พัก
        province: [],       // array รองรับ multi-select จังหวัด
        tour_categories:[],
    });

    // ฟังก์ชันปรับค่าในฟอร์ม
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData({ ...tripData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // อัปโหลดรูปภาพ
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setPictures([...pictures, ...files]);
    };

    // ลบรูปภาพ
    const handleDeleteImage = (index) => {
        setPictures(pictures.filter((_, i) => i !== index));
    };

    // รีเซ็ตฟอร์ม
    const handlereset = () => {
        setTripData({
            tripName: "",
            description: "",
            price: "",
            status: "",
            destination: "",
            typetour: "",
            accommodation: [],
            province: [],
            tour_categories:[],
        });
        setPictures([]);
    };

    // ดึงข้อมูล cetagory
    const fetchCategory = async () => {
        try {
            const res = await ax.get("/tour-categories");
            if (res.data && res.data.data) {
                setCategory(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching tour-categories:", err);
        }
    };

    // ดึงข้อมูลที่พัก
    const fetchAccommodations = async () => {
        try {
            const res = await ax.get("/accommodations");
            if (res.data && res.data.data) {
                setAccommodations(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching accommodations:", err);
        }
    };

    // ดึงข้อมูลจังหวัด (Region)
    const fetchRegion = async () => {
        try {
            const res = await ax.get("/regions");
            if (res.data && res.data.data) {
                setRegion(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching regions:", err);
        }
    };

    // อัปโหลดไฟล์รูปภาพ
    const uploadImage = async () => {
        try {
            const formData = new FormData();
            pictures.forEach((file) => {
                formData.append("files", file);
            });

            const res = await ax.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
            return null;
        }
    };

    // สร้างทัวร์
    const maketrip = async (uploadedFiles) => {
        try {
            const res = await ax.post("/tours", {
                data: {
                    tour_name: tripData.tripName,
                    description: tripData.description,
                    price: Number(tripData.price),
                    tour_status: tripData.status,
                    destination: tripData.destination,
                    tour_type: tripData.typetour,
                    image: uploadedFiles ? uploadedFiles.map((file) => file.id) : [],
                    accommodations: tripData.accommodation, // ส่ง array ของที่พักที่เลือก
                    regions: tripData.province,             // ส่ง array ของจังหวัดที่เลือก
                    tour_categories: tripData.tour_categories,
                },
            });

            showSuccess("Create Tour Success");
            return res.data;
        } catch (err) {
            showError("Error: " + err.message);
            console.error("Error:", err.response ? err.response.data : err.message);
            throw err;
        }
    };

    // ตรวจสอบและสร้างทัวร์
    const handlecreatetrip = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!tripData.tripName) newErrors.tripName = "กรุณากรอกชื่อทริปต์";
        if (!tripData.description) newErrors.description = "กรุณากรอกคำอธิบายทริปต์";
        if (!tripData.price) newErrors.price = "กรุณากรอกราคา";
        if (!tripData.destination) newErrors.destination = "กรุณากรอกจุดหมายปลายทาง";
        if (!tripData.status) newErrors.status = "กรุณาเลือกสถานะ";
        if (!tripData.typetour) newErrors.typetour = "กรุณาเลือกประเภททัวร์";
        if (!tripData.tour_categories) newErrors.tour_categories = "กรุณาเลือกประเภททัวร์";

        // ถ้าเป็น Package with Accommodation ต้องเลือกที่พัก
        if (
            tripData.typetour === "Package with Accommodation" &&
            (!tripData.accommodation || tripData.accommodation.length === 0)
        ) {
            newErrors.accommodation = "กรุณาเลือกที่พักสำหรับแพ็คเกจทัวร์";
        }

        // ต้องเลือกจังหวัดอย่างน้อย 1 จังหวัด
        if (tripData.province.length === 0) {
            newErrors.province = "กรุณาเลือกจังหวัด";
        }

        setErrors(newErrors);

        // ถ้าไม่มี error จึงอัปโหลดรูปและสร้างทัวร์
        if (Object.keys(newErrors).length === 0) {
            let uploadedFiles = null;
            if (pictures.length > 0) {
                uploadedFiles = await uploadImage();
                if (!uploadedFiles) {
                    showError("การอัปโหลดภาพล้มเหลว");
                    return;
                }
            }
            maketrip(uploadedFiles);
        }else{
            showWarning("กรุณากรอกข้อมูลให้ครบถ้วน")
        };
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
    useEffect(() => {
        fetchCategory();
        fetchAccommodations();
        fetchRegion();
    }, []);

    // สร้าง options สำหรับ Category (จังหวัด)
    const categoryOptions = categorys.map((category) => ({
        value: category.id,
        label: category.category_name,
    }));

    // สร้าง options สำหรับ Region (จังหวัด)
    const provinceOptions = regions.map((region) => ({
        value: region.id,
        label: region.province,
    }));

    // สร้าง options สำหรับ Accommodation (ที่พัก)
    const accommodationOptions = accommodations.map((accommodation) => ({
        value: accommodation.id,
        label: accommodation.name,
    }));

    // สไตล์ของ React-Select (เปลี่ยนสีแท็กที่เลือกเป็นสีเขียว)
    const customStyles = {
        multiValue: (base) => ({
            ...base,
            backgroundColor: "#D0F2D0", // เขียวอ่อน
            borderRadius: "4px",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "#2E7D32", // เขียวเข้ม
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "#2E7D32",
            ":hover": {
                backgroundColor: "#2E7D32",
                color: "#FFFFFF",
            },
        }),
    };

    // handleChange สำหรับ Region
    const handleProvinceChange = (selectedOptions) => {
        setTripData({
            ...tripData,
            province: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
        });
    };

    // handleChange สำหรับ Accommodation
    const handleAccommodationChange = (selectedOptions) => {
        setTripData({
            ...tripData,
            accommodation: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
        });
    };

    // handleChange สำหรับ Tour cetagory
    const handleCetagory = (selectedOptions) => {
        setTripData({
            ...tripData,
            tour_categories: selectedOptions
                ? selectedOptions.map((option) => option.value)
                : [],
        });
    };

    return (
        <div>
            <form onSubmit={handlecreatetrip}>
                <div className="text-2xl font-bold mb-4 text-center">Create Tour</div>

                {/* Tour Name */}
                <InputField
                    label="Tour Name"
                    type="text"
                    name="tripName"
                    value={tripData.tripName}
                    onChange={handleChange}
                    placeholder="กรอกชื่อทัวร์"
                    error={errors.tripName}
                />

                {/* Description */}
                <TextareaField
                    label="Description"
                    name="description"
                    value={tripData.description}
                    onChange={handleChange}
                    placeholder="กรอกอธิบายทัวร์"
                    height="200px"
                    error={errors.description}
                />

                {/* Destination / Price */}
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
                        <InputField
                            label="Price"
                            type="number"
                            name="price"
                            value={tripData.price}
                            onChange={handleChange}
                            placeholder="กรอกราคา"
                            error={errors.price}
                        />
                    </div>
                </div>

                {/* Status / Tour Type */}
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
                            error={errors.status}
                        />
                    </div>
                    <div className="w-1/2">
                        <SelectField
                            label="Tour Type"
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
                            error={errors.typetour}
                        />
                    </div>
                </div>

                {/* Region / Accommodation */}
                <div className="flex space-x-4">
                    {/* Region Multi-select */}
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Region
                        </label>
                        <ReactSelect
                            isMulti
                            options={provinceOptions}
                            value={provinceOptions.filter((option) =>
                                tripData.province.includes(option.value)
                            )}
                            onChange={handleProvinceChange}
                            placeholder="เลือกจังหวัด"
                            className="w-full"
                            isSearchable
                            styles={customStyles} // เพิ่มสไตล์สำหรับแท็กสีเขียว
                        />
                        {errors.province && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.province}
                            </div>
                        )}
                    </div>

                    {/* Accommodation Multi-select */}
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Accommodation
                        </label>
                        <ReactSelect
                            isMulti
                            options={accommodationOptions}
                            value={accommodationOptions.filter((option) =>
                                tripData.accommodation.includes(option.value)
                            )}
                            onChange={handleAccommodationChange}
                            placeholder="เลือกที่พัก"
                            className="w-full"
                            isSearchable
                            styles={customStyles} // เพิ่มสไตล์สำหรับแท็กสีเขียว
                        />
                        {errors.accommodation && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.accommodation}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tourtype Multi-select */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Categories
                    </label>
                    <ReactSelect
                        isMulti
                        name="tour_categories"
                        options={categoryOptions}
                        value={categoryOptions.filter(option => 
                            tripData.tour_categories?.includes(option.value)
                        )}
                        onChange={handleCetagory}
                        placeholder="เลือกประเภททัวร์"
                        className="w-full mb-4"
                        isSearchable
                        styles={customStyles}
                    />
                        {errors.tour_categories && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.tour_categories}
                            </div>
                        )}
                </div>

                {/* Image Uploader */}
                <ImageUploader
                    pictures={pictures}
                    handleImageUpload={handleImageUpload}
                    handleDeleteImage={handleDeleteImage}
                />

                {/* ปุ่ม Reset / Submit */}
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
                            htmlType="submit"
                            className="bg-blue-500 text-white p-2 rounded-md"
                        >
                            Submit
                        </Button>
                    </div>
                </div>

                {/* Notification Container */}
                <div>
                    <NotificationContainer
                        notifications={notifications}
                        removeNotification={removeNotification}
                    />
                </div>
            </form>
        </div>
    );
}

export default AddTour;
