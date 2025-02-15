import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import ax from "../../conf/ax";

export default function EditTour({ tour, visible, onClose, onUpdate }) {
  const [formData, setFormData] = useState({ ...tour });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tour) {
      console.log(">>>>>>>", tour);
      setFormData({
        ...formData,
        price: Number(formData.price),
        start: new Date(formData.start).toISOString().split("T")[0],
        end: new Date(formData.end).toISOString().split("T")[0],
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

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      tour_name: formData.name,
      description: formData.description,
      start_date: formData.start,
      end_date: formData.end,
      price: formData.price,
      max_participants: formData.max_participants,
      tour_status: formData.status,
    };
    try {
      const response = await ax.put(`/tours/${tour.documentId}`, {
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

      <div className="flex gap-2">
        <div>
          <label className="block text-gray-700">Start Date</label>
          <Input
            type="date"
            name="start"
            value={formData.start}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date</label>
          <Input
            type="date"
            name="end"
            value={formData.end}
            onChange={handleChange}
          />
        </div>
      </div>

      <label className="block text-gray-700 mt-2">Price</label>
      <Input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="mt-2"
        placeholder="Price"
      />
      <label className="block text-gray-700 mt-2">Max person</label>
      <Input
        type="number"
        name="max_participants"
        value={formData.max_participants}
        onChange={handleChange}
        className="mt-2"
        placeholder="Max"
      />
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
