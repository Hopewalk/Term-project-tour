const axios = require("axios");

// Base URL for Strapi
const STRAPI_BASE_URL = "http://127.0.0.1:1337";

// Your admin token
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQwNjUyMDE1LCJleHAiOjE3NDMyNDQwMTV9.064z1gSqMU8uXVR826DzclXvYDDkGza6tEE3RKTHMgA"; // เปลี่ยนเป็น Token ของคุณ

const northeasternProvinces = [
  ['northeastern', 'อำนาจเจริญ'],
  ['northeastern', 'บึงกาฬ'],
  ['northeastern', 'บุรีรัมย์'],
  ['northeastern', 'ชัยภูมิ'],
  ['northeastern', 'กาฬสินธุ์'],
  ['northeastern', 'ขอนแก่น'],
  ['northeastern', 'เลย'],
  ['northeastern', 'มหาสารคาม'],
  ['northeastern', 'มุกดาหาร'],
  ['northeastern', 'นครพนม'],
  ['northeastern', 'นครราชสีมา'],
  ['northeastern', 'หนองบัวลำภู'],
  ['northeastern', 'หนองคาย'],
  ['northeastern', 'ร้อยเอ็ด'],
  ['northeastern', 'สกลนคร'],
  ['northeastern', 'ศรีสะเกษ'],
  ['northeastern', 'สุรินทร์'],
  ['northeastern', 'อุบลราชธานี'],
  ['northeastern', 'อุดรธานี'],
  ['northeastern', 'ยโสธร']
];

const centralProvinces = [
  ['central', 'อุทัยธานี'],
  ['central', 'อ่างทอง'],
  ['central', 'ชัยนาท'],
  ['central', 'พระนครศรีอยุธยา'],
  ['central', 'กรุงเทพมหานคร'],
  ['central', 'ลพบุรี'],
  ['central', 'นครปฐม'],
  ['central', 'นนทบุรี'],
  ['central', 'ปทุมธานี'],
  ['central', 'สมุทรปราการ'],
  ['central', 'สมุทรสาคร'],
  ['central', 'สมุทรสงคราม'],
  ['central', 'สระบุรี'],
  ['central', 'สิงห์บุรี'],
  ['central', 'สุพรรณบุรี'],
  ['central', 'นครนายก'],
  ['central', 'ฉะเชิงเทรา'],
  ['central', 'จันทบุรี'],
  ['central', 'ชลบุรี'],
  ['central', 'ปราจีนบุรี'],
  ['central', 'ระยอง'],
  ['central', 'สระแก้ว'],
  ['central', 'ตราด'],
  ['central', 'กาญจนบุรี'],
  ['central', 'ราชบุรี'],
  ['central', 'เพชรบุรี'],
  ['central', 'ประจวบคีรีขันธ์']
];

const southernProvinces = [
  ['southern', 'ชุมพร'],
  ['southern', 'นครศรีธรรมราช'],
  ['southern', 'นราธิวาส'],
  ['southern', 'ปัตตานี'],
  ['southern', 'พัทลุง'],
  ['southern', 'สงขลา'],
  ['southern', 'สุราษฎร์ธานี'],
  ['southern', 'ยะลา'],
  ['southern', 'กระบี่'],
  ['southern', 'พังงา'],
  ['southern', 'ภูเก็ต'],
  ['southern', 'ระนอง'],
  ['southern', 'สตูล'],
  ['southern', 'ตรัง']
];

const northernProvinces = [
  ['northern', 'เชียงใหม่'],
  ['northern', 'เชียงราย'],
  ['northern', 'ลำปาง'],
  ['northern', 'ลำพูน'],
  ['northern', 'แม่ฮ่องสอน'],
  ['northern', 'น่าน'],
  ['northern', 'พะเยา'],
  ['northern', 'แพร่'],
  ['northern', 'อุตรดิตถ์'],
  ['northern', 'ตาก'],
  ['northern', 'สุโขทัย'],
  ['northern', 'พิษณุโลก'],
  ['northern', 'พิจิตร'],
  ['northern', 'กำแพงเพชร'],
  ['northern', 'เพชรบูรณ์'],
  ['northern', 'นครสวรรค์']
];

// Array ของจังหวัดและภาค
const provinces = [];

provinces.push(...northeasternProvinces);
provinces.push(...centralProvinces);
provinces.push(...southernProvinces);
provinces.push(...northernProvinces);

// Function to create a province record
const createProvince = async (region, province) => {
  try {
    const payload = {
      data: {
        region,
        province,
      },
    };

    // Send POST request with authorization
    const response = await axios.post(`${STRAPI_BASE_URL}/api/regions`, payload, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });

    console.log(`✅ Province created: ${province}`);
  } catch (err) {
    console.error(
      `❌ Error creating province ${province}:`,
      err.response ? err.response.data : err.message
    );
  }
};

// Create all provinces
const createProvinces = async () => {
  for (let [region, province] of provinces) {
    await createProvince(region, province);
  }
};

createProvinces();
