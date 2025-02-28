import { Pagination } from "antd";

export default function PaginationComponent({
  currentPage,
  pageSize,
  total,
  onChange,
  showTotal,
}) {
  return (
    <div className="flex justify-center mt-6">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        pageSizeOptions={false}
        showTotal={showTotal}
        showQuickJumper
        onChange={onChange}
      />
    </div>
  );
}
