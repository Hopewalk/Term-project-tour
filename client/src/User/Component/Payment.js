import React, { useEffect, useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import qr from "qrcode";
import generatePayload from "promptpay-qr";

export default function Pay({ isModalVisible, setIsModalVisible, totalPrice }) {
  const [qrCode, setQrCode] = useState("");
  const [slip, setSlip] = useState(null);

  useEffect(() => {
    if (totalPrice > 0) {
      const phoneNumber = "0842177462";
      const payload = generatePayload(phoneNumber, { amount: totalPrice });

      qr.toDataURL(payload, (err, url) => {
        if (!err) {
          setQrCode(url);
        }
      });
    }
  }, [totalPrice]);

  const handleUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSlip(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Modal
      title="ชำระเงิน"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsModalVisible(false)}>
          ปิด
        </Button>,
      ]}
    >
      <div className="text-center">
        <h2 className="text-lg font-semibold">Scan QR เพื่อชำระเงิน</h2>
        <p className="text-gray-600 mb-2">จำนวนเงิน: {totalPrice} ฿</p>
        {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto mt-4" />}

        {/* อัปโหลดสลิป */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">อัปโหลดสลิปโอนเงิน</h3>
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
          </Upload>
        </div>

        {/* แสดงสลิปที่อัปโหลด */}
        {slip && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">ตัวอย่างสลิป</h3>
            <img
              src={slip}
              alt="Payment Slip"
              className="mx-auto mt-2 w-60 rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
