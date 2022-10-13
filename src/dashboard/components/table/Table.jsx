import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';


var columns=[]
function TableAnt(props) {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
  
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
  
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
  
    columns = [
      {
        title: 'Mã vật tư',
        dataIndex: 'id',
        key: 'name',
        width: '5%',
        ...getColumnSearchProps('id'),
      },
      {
        title: 'Tên Hàng',
        dataIndex: 'name',
        key: 'age',
        width: '20%',
        ...getColumnSearchProps('name'),
      },
      {
        title: 'Đơn vị',
        dataIndex: 'unit',
        key: 'unit',
        width: '5%',
        sorter: (a, b) => a.unit.length - b.unit.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Đơn giá',
        dataIndex: 'unit_price',
        key: 'unit_price',
        width: '5%',
        sorter: (a, b) => a.unit_price.length - b.unit_price.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'amount',
        width: '5%',
        sorter: (a, b) => a.amount.length - b.amount.length,
        sortDirections: ['descend', 'ascend'],
      },
   
      {
        title: 'Thành tiền',
        dataIndex: 'total_price',
        key: 'total_price',
        width: '5%',
        sorter: (a, b) => a.unit_price.length - b.unit_price.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Tên vật tư',
        dataIndex: 'other_name',
        key: 'other_name',
        width: '5%',
        sorter: (a, b) => a.other_name.length - b.other_name.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Thiết bị',
        dataIndex: 'device',
        key: 'device',
        width: '5%',
        sorter: (a, b) => a.device.length - b.device.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Nhóm vật tư',
        dataIndex: 'groups_material',
        key: 'groups_material',
        width: '5%',
        sorter: (a, b) => a.groups_material.length - b.groups_material.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Xưởng/Bộ phận',
        dataIndex: 'dept',
        key: 'dept',
        width: '5%',
        sorter: (a, b) => a.dept.length - b.dept.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'NCC',
        dataIndex: 'supplier',
        key: 'supplier',
        width: '5%',
        ...getColumnSearchProps('supplier'),
        //sorter: (a, b) => a.supplier.length - b.supplier.length,
        //sortDirections: ['descend', 'ascend'],
        onFilter: (value, record) => {
          return record.supplier.indexOf(value) === 0;
        },
      },
      {
        title: 'Vị trí',
        dataIndex: 'id_layout',
        key: 'id_layout',
        width: '5%',
        ...getColumnSearchProps('id_layout'),
        onFilter: (value, record) => record.id_layout.indexOf(value) === 0, 
      },

      
    ];
    return <Table 
    columns={columns} 
    dataSource={props.value} 
    scroll={{ x: 'calc(700px + 50%)', y: 500 }} 
    pagination={{showSizeChanger:true, pageSizeOptions: ['10', '20', '30','50','100'],defaultPageSize:'10'}}
    />;
}

export default TableAnt
export {columns}