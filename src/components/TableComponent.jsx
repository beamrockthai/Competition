import React, { useState } from "react";
import PropTypes from "prop-types";
import { Table, Input, Grid } from "antd"; // ✅ ใช้ Grid สำหรับ Responsive
import { SearchOutlined } from "@ant-design/icons";
import "./cssTable/tableCustom.css";

const { useBreakpoint } = Grid;

const TableComponent = ({
  columns,
  dataSource,
  pagination = true,
  bordered = true,
  loading = true,
  onRowClick,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const screens = useBreakpoint(); // ✅ ตรวจสอบขนาดหน้าจอ

  // ฟังก์ชันค้นหาข้อมูลในตาราง
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // การกรองข้อมูลในแต่ละแถวของตารางตามการค้นหา
  const filteredDataSource = dataSource.filter((record) =>
    Object.values(record)
      .toString()
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // คอลัมน์ที่ใช้ในการค้นหา
  const enhancedColumns = [
    {
      title: "ลำดับ",
      dataIndex: "rowIndex",
      key: "rowIndex",
      render: (value, record, index) => index + 1, // ลำดับที่เริ่มต้นจาก 1
    },
    ...columns.map((col) => ({
      ...col,
      sorter: col.dataIndex
        ? (a, b) => (a[col.dataIndex] > b[col.dataIndex] ? 1 : -1)
        : null,
    })),
  ];

  return (
    <div>
      {/* Search Bar */}
      <div
        style={{
          marginBottom: "16px",
          textAlign: screens.xs ? "center" : "left",
        }}
      >
        <Input.Search
          className="custom-search-bar"
          placeholder="ค้นหาข้อมูล..."
          enterButton={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: screens.xs ? "100%" : 300, // ✅ ยืดเต็มจอในหน้าจอเล็ก
            maxWidth: "100%", // ✅ ป้องกันล้นกรอบ
          }}
        />
      </div>

      {/* Table */}
      <Table
        loading={loading}
        bordered={bordered}
        pagination={pagination}
        dataSource={filteredDataSource}
        columns={enhancedColumns}
        scroll={{ x: "max-content" }} // ✅ รองรับการเลื่อนในหน้าจอเล็ก
        locale={{ emptyText: "ไม่พบข้อมูล" }}
        onChange={onChange}
        size="small"
        onRow={(record) => ({
          onClick: () => {
            if (onRowClick) {
              onRowClick(record);
            }
          },
          style: {
            cursor: onRowClick ? "pointer" : "default",
          },
        })}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "hover-row-even" : "hover-row-odd"
        }
      />
    </div>
  );
};

// กำหนด propTypes
TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  bordered: PropTypes.bool,
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onRowClick: PropTypes.func,
  onChange: PropTypes.func,
};

export default TableComponent;
