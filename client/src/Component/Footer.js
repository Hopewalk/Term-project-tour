import React from "react";
import { Layout, Space } from "antd";
import {
  FacebookOutlined,
  XOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const webFooter = () => {
  return (
    <Footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/Home" className="hover:text-gray-300">
                  Home
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>123 Travel Street</p>
            <p>หาดใหญ่ สงขลา</p>
            <p>Phone: 999999999</p>
            <p>Email: tour@booking.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <Space size="large">
              <a
                href="https://www.facebook.com"
                className="text-white hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookOutlined style={{ fontSize: "24px" }} />
              </a>
              <a
                href="https://www.twitter.com"
                className="text-white hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XOutlined style={{ fontSize: "24px" }} />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-white hover:text-pink-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramOutlined style={{ fontSize: "24px" }} />
              </a>
            </Space>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} Tour Booking. All rights reserved.
          </p>
        </div>
      </div>
    </Footer>
  );
};

export default webFooter;
