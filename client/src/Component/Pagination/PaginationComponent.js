import React from 'react';
import { Pagination } from "antd";

const PaginationComponent = ({ currentPage, pageSize, total, onChange, showTotal }) => (
  <div className='flex justify-center mt-6'>
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      total={total}
      showSizeChanger={false}
      pageSizeOptions={false}
      showTotal={showTotal ? ((total, range) => `${range[0]}-${range[1]} from ${total}`) : false}
      showQuickJumper
      onChange={onChange}
    />
  </div>
);

export default PaginationComponent;