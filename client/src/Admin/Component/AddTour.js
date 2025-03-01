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
    const [regions, setRegion] = useState([]);
    const { notifications, removeNotification, showSuccess, showError } =
        useNotification();
    const [tripData, setTripData] = useState({
        tripName: "",
        description: "",
        price: "",
        status: "",
        destination: "",
        typetour: "",
        accommodation: "",
        province: [], // เปลี่ยนเป็น array สำหรับรองรับ multi-select
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData({ ...tripData, [name]: value });
        setErrors({ ...errors, [name]: "" });
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
            price: "",
            status: "",
            destination: "",
            typetour: "",
            accommodation: "",
            province: [],
        });
        setPictures([]);
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

    const fetchRegion = async () => {
        try {
            const res = await ax.get("/regions");
            console.log("regions fetched:", res.data);
            if (res.data && res.data.data) {
                setRegion(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching regions:", err);
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
            console.log("Upload success:", res.data);
            return res.data;
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
            return null;
        }
    };

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
                    accommodations: tripData.accommodation ? [tripData.accommodation] : [],
                    regions: tripData.province, // ส่ง array ของจังหวัดที่เลือก
                },
            });

            console.log("Tour created successfully:", res.data);
            showSuccess("Create Tour Success");
            return res.data;
        } catch (err) {
            showError("Error: " + err.message);
            console.error("Error:", err.response ? err.response.data : err.message);
            throw err;
        }
    };

    const handlecreatetrip = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!tripData.tripName)
            newErrors.tripName = "กรุณากรอกชื่อทริปต์";
        if (!tripData.description)
            newErrors.description = "กรุณากรอกคำอธิบายทริปต์";
        if (!tripData.price) newErrors.price = "กรุณากรอกราคา";
        if (!tripData.destination)
            newErrors.destination = "กรุณากรอกจุดหมายปลายทาง";
        if (!tripData.accommodation)
            newErrors.accommodation = "กรุณาเลือกที่พัก";
        if (!tripData.status) newErrors.status = "กรุณาเลือกสถานะ";
        if (!tripData.typetour)
            newErrors.typetour = "กรุณาเลือกประเภททัวร์";

        // เงื่อนไขสำหรับ Package with Accommodation
        if (
            tripData.typetour === "Package with Accommodation" &&
            !tripData.accommodation
        ) {
            newErrors.accommodation = "กรุณาเลือกที่พักสำหรับแพ็คเกจทัวร์";
        }

        // ตรวจสอบการเลือกจังหวัด
        if (tripData.province.length === 0)
            newErrors.province = "กรุณาเลือกจังหวัด";

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
            maketrip(uploadedFiles);
        }else{
            console.log(newErrors)
        };
    };

    useEffect(() => {
        fetchAccommodations();
        fetchRegion();
    }, []);

    const provinceOptions = regions.map((region) => ({
        value: region.id,
        label: region.province,
    }));

    const handleProvinceChange = (selectedOptions) => {
        setTripData({
            ...tripData,
            province: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    return (
        <div>
            <form onSubmit={handlecreatetrip}>
                <div className="text-2xl font-bold mb-4 text-center">
                    Create Tour
                </div>
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
                            onChange={handleProvinceChange}
                            placeholder="เลือกจังหวัด"
                            className="w-full"
                            isSearchable
                        />
                        {errors.province && (
                            <div className="text-red-500 text-xs mt-1">{errors.province}</div>
                        )}
                        {tripData.province.length > 0 && (
                            <div className="mt-2 text-sm text-blue-700">
                                <strong>จังหวัดที่เลือก:</strong>{" "}
                                {provinceOptions
                                    .filter((option) => tripData.province.includes(option.value))
                                    .map((option) => option.label)
                                    .join(", ")}
                            </div>
                        )}
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
                            error={errors.accommodation}
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
