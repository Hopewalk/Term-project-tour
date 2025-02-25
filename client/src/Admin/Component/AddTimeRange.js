import React, { useState } from "react";
import { notification, Button } from "antd";
import { InputField } from "./Tagcomponent";
import ax from "../../conf/ax";

function AddTimeRange() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState({});
    const [repeatEveryYear, setRepeatEveryYear] = useState(false);

    // ฟังก์ชันส่งข้อมูลไปยัง Strapi
    const createReshow = async () => {
        const reshowData = {
        data: {
            Show_date: new Date(startDate).toISOString(),
            Hide_date: new Date(endDate).toISOString(),
            repeat_every_year: repeatEveryYear,
        },
        };

        try {
        const response = await ax.post("/time-ranges", reshowData);
        console.log("สร้าง Create Tour Reshow Date สำเร็จ");
        } catch (error) {
        console.error("Error:", error);
        }
    };

    const handlereset = () => {
        setStartDate("");
        setEndDate("");
        setRepeatEveryYear(false);
        setError({});
    };

    const handlesubmit = async () => {
        let newError = {};
        if (!startDate) {
        newError.Start = "กรุณากรอกวันที่เริ่มต้น";
        }
        if (!endDate) {
        newError.End = "กรุณากรอกวันที่สิ้นสุด";
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
        newError.dateOrder = "Start date must be before end date";
        }
        if (Object.keys(newError).length > 0) {
        setError(newError);
        return;
        }
        setError({});
        await createReshow();
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setError((prev) => ({ ...prev, Start: "" }));
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setError((prev) => ({ ...prev, End: "" }));
    };

    const handleRepeatChange = (e) => {
        setRepeatEveryYear(e.target.checked);
    };

    return (
        <div className="flex flex-col space-y-4">
        <div className="text-2xl font-bold mb-4 text-center">
            Create Tour Reshow Date
        </div>
        <div className="flex space-x-4">
            <div className="w-1/2">
            <InputField
                label="The beginning of the display"
                type="datetime-local"
                name="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                error={error.Start}
            />
            </div>
            <div className="w-1/2">
            <InputField
                label="The Ending of the display"
                type="datetime-local"
                name="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                error={error.End}
            />
            </div>
        </div>

        {/* Checkbox for repeat every year */}
        <div className="flex items-center mt-4">
            <input
            type="checkbox"
            id="repeatEveryYear"
            checked={repeatEveryYear}
            onChange={handleRepeatChange}
            className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="repeatEveryYear" className="ml-2 text-gray-700">
            Repeat Every Year
            </label>
        </div>

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
                onClick={handlesubmit}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
                Submit
            </Button>
            </div>
        </div>
        </div>
    );
    }

export default AddTimeRange;
