import React, { useState } from "react";
import { notification ,Button } from "antd";
import { InputField } from "./Tagcomponent";
import ax from "../../conf/ax";


function AddTimeRange() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [repeatEveryYear, setRepeatEveryYear] = useState(false);

    // แยก handleChange สำหรับ StartDate และ EndDate
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleRepeatChange = (e) => setRepeatEveryYear(e.target.checked);

    // ฟังก์ชันส่งข้อมูลไปยัง Strapi
    const handleSubmit = async () => {
        const reshowData = {
            data: {
                Show_date: new Date (startDate),
                Hide_date: new Date (endDate),
                repeat_every_year: repeatEveryYear
            }
        };

        try {
            const response = await ax.post("/time-ranges", reshowData);

            notification.success({
                message: 'สำเร็จ',
                description: 'Reshow Tour บันทึกสำเร็จ!',
                placement: 'topRight',
                duration: 3
            });
            
        } catch (error) {
            console.error("Error:", error);
            notification.error({
                message: 'เกิดข้อผิดพลาด',
                description: error.response?.data?.error?.message || 'ไม่สามารถเชื่อมต่อกับ server',
                placement: 'topRight',
                duration: 3
            });
        }
    };

    const handlereset =()=>{
        setStartDate("");
        setEndDate("");
        setRepeatEveryYear(false);
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <InputField
                        label="The beginning of the display"
                        type="datetime-local"
                        name="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                <div className="w-1/2">
                    <InputField
                        label="The Ending of the display"
                        type="datetime-local"
                        name="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
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
                    onclick={handleSubmit}
                    className="bg-blue-500 text-white p-2 rounded-md"
                    >
                    submit
                    </Button>
                </div>
                </div>
        </div>
    );
}

export default AddTimeRange;
