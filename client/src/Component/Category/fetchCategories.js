import { EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";

const fetchCategories = async () => [
  { icon: <EnvironmentOutlined />, label: "One Day Trip", params: "One Day Trip" },
  { icon: <HomeOutlined />, label: "แพ็กเกจพร้อมที่พัก", params: "Package with Accommodation" },
];

export default fetchCategories;