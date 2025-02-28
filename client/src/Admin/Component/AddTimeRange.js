import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { InputField, SelectField } from "./Tagcomponent";
import ax from "../../conf/ax";

function AddTimeRange() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [participants, setParticipants] = useState("");
    const [selectedTour, setSelectedTour] = useState("");
    const [tours, setTours] = useState([]);
    const [error, setError] = useState({});

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const res = await ax.get("/tours");
            console.log("Tours fetched:", res.data);
            if (res.data?.data) {
                setTours(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching tours:", err);
        }
    };

    const createtimerange = async () => {
        const reshowData = {
            data: {
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                max_participants: Number(participants),
                tour: Number(selectedTour)
            }
        };

        try {
            const response = await ax.post("/time-ranges", reshowData);
            console.log("Create Tour Time Range Success:", response.data);
        } catch (error) {
            console.error("Error creating time range:", error);
        }
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setParticipants("");
        setSelectedTour("");
        setError({});
    };

    const handleSubmit = async () => {
        let newError = {};
    
        if (!selectedTour) newError.tour = "กรุณาเลือกทัวร์";
        if (!startDate) newError.start = "กรุณากรอกวันที่เริ่มต้น";
        if (!endDate) newError.end = "กรุณากรอกวันที่สิ้นสุด";
        if (!participants) newError.participants = "กรุณากรอกจำนวนผู้เข้าร่วม";
        if (new Date(startDate) >= new Date(endDate)) {
            newError.dateOrder = "วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด";
        }
    
        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        } else {
            createtimerange();
        }
    
        setError({});
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        switch (name) {
            case "startDate":
                setStartDate(value);
                setError(prev => ({ ...prev, start: "", dateOrder: "" }));
                break;
            case "endDate":
                setEndDate(value);
                setError(prev => ({ ...prev, end: "", dateOrder: "" }));
                break;
            case "participants":
                setParticipants(value);
                setError(prev => ({ ...prev, participants: "" }));
                break;
            case "tour":
                setSelectedTour(value);
                setError(prev => ({ ...prev, tour: "" }));
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Set Tour Schedule
            </h2>

            <SelectField
                label="Select Tour"
                name="tour"
                value={selectedTour}
                onChange={handleChange}
                options={tours.map(tour => ({
                    value: tour.id,
                    label: tour.tour_name
                }))}
                error={error.tour}
            />

            <InputField
                label="Number of Participants"
                type="number"
                name="participants"
                value={participants}
                onChange={handleChange}
                error={error.participants}
            />

            <div className="flex space-x-4">
                <div className="w-1/2">
                    <InputField
                        label="Start Date"
                        type="datetime-local"
                        name="startDate"
                        value={startDate}
                        onChange={handleChange}
                        error={error.start}
                    />
                </div>
                <div className="w-1/2">
                    <InputField
                        label="End Date"
                        type="datetime-local"
                        name="endDate"
                        value={endDate}
                        onChange={handleChange}
                        error={error.end}
                    />
                </div>
            </div>

            {error.dateOrder && (
                <span className="text-red-500 text-sm">{error.dateOrder}</span>
            )}

            <div className="flex justify-end space-x-4 mt-4">
                <Button
                    onClick={handleReset}
                    className="bg-yellow-500 text-white p-2 rounded-md"
                >
                    Reset
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default AddTimeRange;