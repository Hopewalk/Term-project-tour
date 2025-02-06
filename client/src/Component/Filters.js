import { Slider, Radio, Checkbox, Rate } from "antd";

export function FilterSidebar() {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">เรียงผลการค้นหา</h3>
          <Radio.Group defaultValue="popular">
            <div className="flex items-center space-x-2 mb-2">
              <Radio value="popular">ยอดนิยม</Radio>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Radio value="price-low">เรียงราคาต่ำสุดก่อน</Radio>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Radio value="price-high">เรียงราคาสูงสุดก่อน</Radio>
            </div>
          </Radio.Group>
        </div>

        <div>
          <h3 className="font-semibold mb-4">ราคา</h3>
          <div className="px-2">
            <Slider
              defaultValue={[1500]}
              max={90000}
              min={1000}
              step={1000}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1000 THB</span>
              <span>90000 THB</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">ระดับดาว</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox />
                <Rate
                  disabled
                  defaultValue={rating}
                  count={rating}
                  className="text-yellow-400"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
