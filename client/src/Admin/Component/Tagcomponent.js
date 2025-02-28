import {Button} from "antd";

// InputField
const InputField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  readOnly = false, 
  min = null, 
  max = null, 
  step = "any", 
  error, 
  onInput = () => {} // ✅ กำหนดค่าเริ่มต้น
}) => (
  <div className="mb-4">
    <label className="block text-left mb-2">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      className={`border ${error ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full`}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      min={min}
      max={max}
      step={step}
      onInput={(e) => {
        if (max !== null && parseFloat(e.target.value) > max) {
          e.target.value = max;
        }
        if (min !== null && parseFloat(e.target.value) < min) {
          e.target.value = min;
        }
        onInput(e); // ✅ เรียกใช้งานฟังก์ชัน onInput (ถ้ามีการส่งมา)
      }}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

  
  // TextareaField
  const TextareaField = ({ label, name, value, onChange, placeholder, height = "100px", required = false, error }) => (
    <div className="mb-4">
      <label className="block text-left mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full`}
        placeholder={placeholder}
        style={{ height }}
        value={value}
        onChange={onChange}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
  
  // SelectField
  const SelectField = ({ label, name, value, onChange, options, error }) => (
    <div className="mb-4">
      <label className="block text-left mb-2">{label}</label>
      <select
        name={name}
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md w-full`}
        value={value}
        onChange={onChange}
      >
        <option value="">ไม่เลือก</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
  
  // ImageUploader
  const ImageUploader = ({ pictures, handleImageUpload, handleDeleteImage }) => (
    <div className="mb-4">
      <label className="block text-left mb-2">ภาพ **ภาพแรกที่อัปโหลดจะถูกนำไปใช้เป็น thumnail**</label>
      <input
        type="file"
        multiple
        className="border border-gray-300 p-2 rounded-md w-full"
        onChange={handleImageUpload}
      />
      <div className="mt-2">
        {pictures.map((picture, index) => (
          <div key={index} className="flex items-center justify-between border p-2 rounded-md mb-2">
            <img
              src={URL.createObjectURL(picture)}
              alt={`upload-${index}`}
              className="w-32 h-32 object-cover rounded-md"
            />
            <Button type="button" className="bg-red-500 text-white p-1 rounded-md" onClick={() => handleDeleteImage(index)}>
              ลบ
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
  


  export { InputField, TextareaField, SelectField, ImageUploader };