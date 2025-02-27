import { Pagination } from 'antd';

export default function PaginationComponent({ currentPage, pageSize, total, onChange }) {
    return (
        <div className='flex justify-center mt-6'>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                showSizeChanger={false}
                pageSizeOptions={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} tours`}
                showQuickJumper
                onChange={onChange}
            />
        </div>
    );
}