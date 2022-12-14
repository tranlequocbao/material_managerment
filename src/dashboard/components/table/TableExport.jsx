import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm, Typography, Form ,notification} from 'antd';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {<Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

var columns = []
function TableExport(props) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('')
  const [dataTable,setDataTable]=useState([])
  const isEditing = (record) => record.key === editingKey;

  React.useEffect(()=>{
    setDataTable(props.value)
  },[props.value])
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };


    // thông báo
    const openNotification = (status, type) => {
      notification[type]({
        message: 'THÔNG BÁO',
        description: status,
      });
    };
  const onSubmitModify = async (value) => {
    
    try {
      
        const row = await form.validateFields();
        const newData =[...props.value]
        const index = newData.findIndex((items)=>value['key']===items.key)
       var amount = row['amount']
      var values={}
       if(props.type==='import'){
        
        row['total_price']=parseInt(row['amount'])* parseInt(value['unit_price']) 
        row['amount']=row['amount']-value['amount']
        values={'id':value['id_material'],'supplier':value['supplier'],'unitPriceOld':value['unit_price'],'idLayout':value['position'],'amountOld':value['amount'],'datetime':value['created_at'],'type':props.type,...row}
         row['amount']=amount
       }
       else  values={'id':value['id_material'],'supplier':value['supplier'],'unitPriceOld':value['unit_price'],'idLayout':value['position'],'amountOld':value['amount'],'datetime':value['created_at'],'type':props.type,...row}
   
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });  
            axios.post('http://113.174.246.52:8082/api/modifyHis_materialManagerment', { values })
        .then((res) => {
          if (res.data['errno']) {
            openNotification("THÊM DỮ LIỆU THẤT BẠI", 'error',)
            setEditingKey('');
          }
          else
            openNotification("HIỆU CHỈNH DỮ LIỆU THÀNH CÔNG", 'success',)
            setEditingKey('');
            setDataTable(newData)
        })
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }

  }

  const cancel = () => {
    setEditingKey('');
  };
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
      width: '20%',
      fixed:'left',
      ...getColumnSearchProps('id_material'),
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'name_material',
      key: 'name',
      width: '40%',
      ...getColumnSearchProps('name_material'),
    },
    {
      title: 'Người Nhập',
      dataIndex: 'person_action',
      key: 'address',
      width: '30%',
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
      width: '20%',
      sorter: (a, b) => a.unit_price.length - b.unit_price.length,
      sortDirections: ['descend', 'ascend'],
     
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      key: 'address',
      width: '20%',
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
      width: '20%',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      sortDirections: ['descend', 'ascend'],
      // render:(record)=>{
      //   return ()
      // }
    },
    {
      title: 'Xưởng',
      dataIndex: 'dept',
      key: 'address',
      width: '20%',
      sorter: (a, b) => a.dept.length - b.dept.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '30%',
      sorter: (a, b) => a.supplier.length - b.supplier.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Mục đích sử dụng',
      dataIndex: 'purpose',
      key: 'supplier',
      width: '30%',
      sorter: (a, b) => a.purpose.length - b.purpose.length,
      sortDirections: ['descend', 'ascend'],
      editable: props.type==='export'?true:false,
    },
    {
      title: 'Hạng mục sử dụng',
      dataIndex: 'item',
      key: 'item',
      width: '30%',
      sorter: (a, b) => a.item.length - b.item.length,
      sortDirections: ['descend', 'ascend'],
      editable: props.type==='export'?true:false,
    },
    {
      title: 'Người nhận',
      dataIndex: 'receiver',
      key: 'receiver',
      width: '10%',
      sorter: (a, b) => a.receiver.length - b.receiver.length,
      sortDirections: ['descend', 'ascend'],
      editable: props.type==='export'?true:false,
    },
  
    {
      title: 'Sửa',
      dataIndex: 'operation',
      width: '15%',
      render: ((_, record) => {
       var currentMonth = new Date(record.created_at).getMonth()+1
       var currentYear = new Date(record.created_at).getFullYear()
       
       if(currentMonth=== new Date().getMonth()+1&&currentYear=== new Date().getFullYear()){
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onSubmitModify(record)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Hiệu chỉnh
          </Typography.Link>
        );}
      }),
    },

  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return(
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowClassName="editable-row"
        columns={mergedColumns}
        dataSource={dataTable&&dataTable}
        scroll={{ x: 'calc(700px + 50%)', y: 500 }}
        pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50', '100'], defaultPageSize: '10' }}
      />
    </Form>
  )
}

export default TableExport
export { columns }