"use client";

import { Layout, Typography, Space } from "antd";
import { Link } from "react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Youtube,
  Waves,
} from "lucide-react";

const { Footer } = Layout;
const { Title, Text } = Typography;

const footerColumns = {
  Solutions: ["Marketing", "Analytics", "Automation", "Commerce", "Insights"],
  Support: ["Submit ticket", "Documentation", "Guides"],
  Company: ["About", "Blog", "Jobs", "Press"],
  Legal: ["Terms of service", "Privacy policy", "License"],
};

const socialLinks = [
  { icon: <Facebook />, label: "Facebook", href: "https://facebook.com" },
  { icon: <Instagram />, label: "Instagram", href: "https://instagram.com" },
  { icon: <Twitter />, label: "Twitter", href: "https://twitter.com" },
  { icon: <Github />, label: "GitHub", href: "https://github.com" },
  { icon: <Youtube />, label: "YouTube", href: "https://youtube.com" },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <Title level={5} className="!text-white !mb-4">
      {title}
    </Title>
    <ul className="space-y-3">
      {links.map((item) => (
        <li key={item}>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function webFooter() {
  return (
    <Footer className="bg-[#0D1117] min-h-[400px] px-4 py-16 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Waves className="text-[#818CF8] w-8 h-8" />
              <span className="sr-only">Your Company</span>
            </Link>
            <Text className="block text-gray-400 max-w-xs">
              Making the world a better place through constructing elegant
              hierarchies.
            </Text>
            <Space className="flex gap-4">
              {socialLinks.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="w-6 h-6">{icon}</span>
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </Space>
          </div>

          {/* Footer Columns */}
          {Object.entries(footerColumns).map(([title, links]) => (
            <FooterColumn key={title} title={title} links={links} />
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <Text className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Your Company, Inc. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  );
}
