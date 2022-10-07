import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';


var columns=[]
function TableExport(props) {
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
        dataIndex: 'id_material',
        key: 'id',
        width: '10%',
        ...getColumnSearchProps('id_material'),
      },
      {
        title: 'Tên Hàng',
        dataIndex: 'name_material',
        key: 'name',
        width: '20%',
        ...getColumnSearchProps('name_material'),
      },
      {
        title: 'Người Nhập',
        dataIndex: 'person_action',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.person_action.length - b.person_action.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.amount.length - b.amount.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Đơn giá',
        dataIndex: 'unit_price',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.unit_price.length - b.unit_price.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Thành tiền',
        dataIndex: 'total_price',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.unit_price.length - b.unit_price.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Vị trí',
        dataIndex: 'position',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.position.length - b.position.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Ngày nhập',
        dataIndex: 'created_at',
        key: 'address',
        width: '10%',
        sorter: (a, b) => a.created_at.length - b.created_at.length,
        sortDirections: ['descend', 'ascend'],
      },

      
    ];
    return <Table 
    columns={columns} 
    dataSource={props.value} 
    scroll={{ x: 'calc(700px + 50%)', y: 500 }} 
    pagination={{showSizeChanger:true, pageSizeOptions: ['10', '20', '30','50'],defaultPageSize:'50'}}
     />;
}

export default TableExport
export {columns}