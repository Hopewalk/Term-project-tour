import React from "react";
import { FilterSidebar } from "./Component/Filters";
import Category from "./Component/Category";
import Thailandbg from "./Images/Thailand-bg.png";
import SearchBar from "./Component/Search";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="h-[300px] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${Thailandbg})`,
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">ทัวร์และกิจกรรมต่างๆ</h2>
        <Category />
        <div className="flex gap-8 mt-8">
          <FilterSidebar />
          <h1>card or grid for tour packages</h1>
        </div>
      </div>
    </main>
  );
}
