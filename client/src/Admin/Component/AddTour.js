import React, { useState, useEffect } from "react";
import { Button } from "antd";
import ax from "../../conf/ax";
import { useNotification, NotificationContainer } from "./notification";
import {
    InputField,
    TextareaField,
    SelectField,
    ImageUploader,
    option,
    customStyles,
} from "./Tagcomponent";
import ReactSelect from "react-select";

function AddTour() {
    const [pictures, setPictures] = useState([]);
    const [errors, setErrors] = useState({});
    const [accommodations, setAccommodations] = useState([]);
    const [categories, setCategories] = useState([]); // แก้จาก categorys เป็น categories
    const [regions, setRegions] = useState([]); // แก้ชื่อให้ชัดเจน
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
        accommodation: [],
        province: [],
        tour_categories: [],
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
            tour_categories: [],
        });
        setPictures([]);
        setErrors({}); // รีเซ็ต errors ด้วย
    };

    // ดึงข้อมูล categories
    const fetchCategories = async () => { // แก้ชื่อฟังก์ชันให้ชัดเจน
        try {
            const res = await ax.get("/tour-categories");
            if (res.data && res.data.data) {
                setCategories(res.data.data);
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
    const fetchRegions = async () => { // แก้ชื่อให้ชัดเจน
        try {
            const res = await ax.get("/regions");
            if (res.data && res.data.data) {
                setRegions(res.data.data);
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
                    accommodations: tripData.accommodation,
                    regions: tripData.province,
                    tour_categories: tripData.tour_categories,
                },
            });

            showSuccess("Create Tour Success");
            handlereset(); // รีเซ็ตฟอร์มหลังสำเร็จ
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

        if (
            tripData.typetour === "Package with Accommodation" &&
            (!tripData.accommodation || tripData.accommodation.length === 0)
        ) {
            newErrors.accommodation = "กรุณาเลือกที่พักสำหรับแพ็คเกจทัวร์";
        }

        if (tripData.province.length === 0) {
            newErrors.province = "กรุณาเลือกจังหวัด";
        }

        if (tripData.accommodation.length === 0) {
            newErrors.accommodation = "กรุณาเลือกที่พัก";
        }

        if (tripData.tour_categories.length === 0) {
            newErrors.tour_categories = "กรุณาเลือกประเภททัวร์";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            let uploadedFiles = null;
            if (pictures.length > 0) {
                uploadedFiles = await uploadImage();
                if (!uploadedFiles) {
                    showError("การอัปโหลดภาพล้มเหลว");
                    return;
                }
            }
            await maketrip(uploadedFiles);
        } else {
            showWarning("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
    useEffect(() => {
        fetchCategories();
        fetchAccommodations();
        fetchRegions();
    }, []);


    // สร้าง options สำหรับ Categories,Regions,Accommodations
    const categoryOptions = option(categories,"category_name")
    const provinceOptions = option(regions,"province") 
    const accommodationOptions = option(accommodations,"name")

    const handleMultiSelectChange = (selectedOptions, field) => {
        const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        setTripData({ ...tripData, [field]: values });
        setErrors({ ...errors, [field]: "" });
    };
    
    return (
        <div>
            <form onSubmit={handlecreatetrip}>
                <div className="text-2xl font-bold mb-4 text-center">Create Tour</div>

                <InputField
                    label="Tour Name"
                    type="text"
                    name="tripName"
                    value={tripData.tripName}
                    onChange={handleChange}
                    placeholder="กรอกชื่อทัวร์"
                    error={errors.tripName}
                />

                <TextareaField
                    label="Description"
                    name="description"
                    value={tripData.description}
                    onChange={handleChange}
                    placeholder="กรอกอธิบายทัวร์"
                    height="200px"
                    error={errors.description}
                />

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

                <div className="flex space-x-4">
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
                            onChange={(selectedOptions) =>handleMultiSelectChange(selectedOptions, "province")}
                            placeholder="เลือกจังหวัด"
                            className="w-full"
                            isSearchable
                            styles={customStyles()}
                        />
                        {errors.province && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.province}
                            </div>
                        )}
                    </div>

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
                            onChange={(selectedOptions) =>handleMultiSelectChange(selectedOptions, "accommodation")}
                            placeholder="เลือกที่พัก"
                            className="w-full"
                            isSearchable
                            styles={customStyles()}
                        />
                        {errors.accommodation && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.accommodation}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Categories
                    </label>
                    <ReactSelect
                        isMulti
                        options={categoryOptions}
                        value={categoryOptions.filter((option) =>
                            tripData.tour_categories.includes(option.value)
                        )}
                        onChange={(selectedOptions) =>handleMultiSelectChange(selectedOptions,"tour_categories")}
                        placeholder="เลือกประเภททัวร์"
                        className="w-full mb-4"
                        isSearchable
                        styles={customStyles()}
                    />
                    {errors.tour_categories && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.tour_categories}
                        </div>
                    )}
                </div>

                <ImageUploader
                    pictures={pictures}
                    handleImageUpload={handleImageUpload}
                    handleDeleteImage={handleDeleteImage}
                />

                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        onClick={handlereset}
                        className="bg-yellow-500 text-white p-2 rounded-md"
                    >
                        Reset data field
                    </Button>
                    <Button
                        htmlType="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Submit
                    </Button>
                </div>

                <NotificationContainer
                    notifications={notifications}
                    removeNotification={removeNotification}
                />
            </form>
        </div>
    );
}

export default AddTour;