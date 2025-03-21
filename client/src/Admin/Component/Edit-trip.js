import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import ax from "../../conf/ax";

export default function EditTour({
  tour,
  visible,
  onClose,
  onUpdate,
  categories,
}) {
  const [formData, setFormData] = useState({ ...tour });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tour) {
      setFormData({
        ...formData,
        price: Number(formData.price),
      });
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value });
  };
  const handleCategoryChange = (value) => {
    setFormData({ ...formData, categories: value });
  };

  const handleSave = async () => {
    if (!formData.categories || formData.categories.length === 0) {
      return;
    }
    setLoading(true);
    const dataToSend = {
      tour_name: formData.name,
      description: formData.description,
      price: formData.price,
      tour_status: formData.status,
      tour_categories: formData.categories ? formData.categories : [],
    };
    try {
      await ax.put(`/tours/${tour.documentId}`, {
        data: dataToSend,
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating tour:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimeRange = async (timeRangeId) => {
    const isConfirmed = window.confirm("ต้องการลบช่วงเวลานี้ใช่หรือไม่?");
    if (!isConfirmed) return;

    try {
      await ax.delete(`/time-ranges/${timeRangeId}`);
      setFormData((prev) => ({
        ...prev,
        timerange: prev.timerange.filter((t) => t.documentId !== timeRangeId),
      }));
    } catch (error) {
      console.error("ลบ Time Range ไม่สำเร็จ");
    }
  };

  return (
    <Modal title="Edit Tour" open={visible} onCancel={onClose} footer={null}>
      <label className="block text-gray-700">Tour Name</label>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="mb-2"
        placeholder="Tour Name"
      />

      <label className="block text-gray-700">Description</label>
      <Input.TextArea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="mb-2"
        placeholder="Description"
      />

      <label className="block text-gray-700 mt-2">Price</label>
      <Input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="mt-2"
        placeholder="Price"
      />
      <label className="block text-gray-700 mt-2">Category</label>
      <Select
        value={formData.categories}
        onChange={handleCategoryChange}
        mode="multiple"
        className="w-full mt-2"
        placeholder="Please select categories"
      >
        {categories.map((category) => (
          <Select.Option key={category.id} value={category.id}>
            {category.name}
          </Select.Option>
        ))}
      </Select>
      {!formData.categories || formData.categories.length === 0 ? (
        <div style={{ color: "red", fontSize: "12px" }}>
          โปรดเลือกอย่างน้อย 1 Category
        </div>
      ) : null}

      <label className="block text-gray-700 mt-2">Time Ranges</label>
      <div className="border p-2 rounded-md mt-2">
        {formData.timerange?.length > 0 ? (
          formData.timerange.map((time) => (
            <div
              key={time.documentId}
              className="flex justify-between items-center border-b pb-1 mb-1"
            >
              <span>
                {new Date(time.createdAt).toLocaleString()} -{" "}
                {new Date(time.updatedAt).toLocaleString()}
              </span>
              <Button
                danger
                size="small"
                onClick={() => handleDeleteTimeRange(time.documentId)}
              >
                ลบ
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">ไม่มี Time Range</p>
        )}
      </div>
      <label className="block text-gray-700 mt-2">Status</label>
      <Select
        value={formData.status}
        onChange={handleStatusChange}
        className="w-full mt-2"
      >
        <Select.Option value="available">Available</Select.Option>
        <Select.Option value="unavailable">Unavailable</Select.Option>
      </Select>

      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button type="primary" onClick={handleSave} loading={loading}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
