import {
  AppstoreOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

const categories = [
  { icon: TeamOutlined, label: "ทัวร์ท่องเที่ยว" },
  { icon: HomeOutlined, label: "แพ็กเกจพร้อมที่พัก" },
  { icon: AppstoreOutlined, label: "ทั้งหมด" },
];

export default function Category() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Button
          key={category.label}
          className="flex flex-col items-center justify-center p-10 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        >
          <category.icon className="h-6 w-6 mb-2" />
          <span className="text-sm text-center">{category.label}</span>
        </Button>
      ))}
    </div>
  );
}
