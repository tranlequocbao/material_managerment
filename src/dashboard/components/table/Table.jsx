import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Form, notification, Popconfirm, Typography, Modal } from 'antd';
import React, { useContext, useRef, useState, } from 'react';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { setColumn } from '../Exist';

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

function TableAnt(props) {
  const { setColumns, checkNow } = useContext(setColumn)
  const [dataTable, setDataTable] = useState('')
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState('')
  ///... form for edit cell table
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('')
  const levelUser = parseInt(JSON.parse(localStorage.getItem('level')))
  const [name,setName]=useState('')
  React.useEffect(() => {
    setColumns(columns)
    setDataTable(props.value)
  }, [props.value])
  const isEditing = (record) => record.key === editingKey;
  // thông báo
  const openNotification = (status, type) => {
    notification[type]({
      message: 'THÔNG BÁO',
      description: status,
    });
  };

  //........MODAL..............
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const onSubmitModify = async (value) => {
    try {
      const row = await form.validateFields();
      const newData = [...props.value]
      const index = newData.findIndex((items) => value['key'] === items.key)
      const values = { 'id': value['id'], 'supplierOld': value['supplier'], 'unit_price': value['unit_price'], 'idLayoutOld': value['id_layout'], ...row }
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      axios.post('http://113.174.246.52:8082/api/modifyInfo_materialManagerment', { values })
        .then((res) => {
          if (res.data['errno']) {
            openNotification("THÊM DỮ LIỆU THẤT BẠI", 'error',)
            setEditingKey('');
          }
          else
            openNotification("HIỆU CHỈNH DỮ LIỆU THÀNH CÔNG", 'success',)
          setDataTable(newData)
          setEditingKey('');
        })
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }

  }
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
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
  const columns = [
    {
      title: 'Mã vật tư',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
      fixed: 'left',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Tên Hàng',
      dataIndex: 'name',
      width: '50%',
      key: 'name',
      editable: checkNow && true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      width: '10%',
      key: 'unit',
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      width: '15%',
      key: 'unit_price',
      sorter: (a, b) => a.unit_price.length - b.unit_price.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      width: '15%',
      key: 'amount',
      sorter: (a, b) => a.amount.length - b.amount.length,
      sortDirections: ['descend', 'ascend'],
    },

    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      width: '15%',
      sorter: (a, b) => a.unit_price.length - b.unit_price.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'other_name',
      key: 'other_name',
      width: '15%',
      sorter: (a, b) => a.other_name.length - b.other_name.length,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'Thiết bị',
      dataIndex: 'device',
      key: 'device',
      width: '15%',
      sorter: (a, b) => a.device.length - b.device.length,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'Nhóm vật tư',
      dataIndex: 'groups_material',
      key: 'groups_material',
      width: '15%',
      sorter: (a, b) => a.groups_material.length - b.groups_material.length,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'Xưởng/Bộ phận',
      dataIndex: 'dept',
      key: 'dept',
      width: '15%',
      sorter: (a, b) => a.dept.length - b.dept.length,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'NCC',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '15%',
      editable: true,
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
      width: '15%',
      editable: true,
      ...getColumnSearchProps('id_layout'),
      onFilter: (value, record) => record.id_layout.indexOf(value) === 0,
    },
    {
      title: 'Sửa',
      dataIndex: 'operation',
      width: '15%',
      render: levelUser && levelUser < 3 ? (checkNow && ((_, record) => {
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
        );
      })) : '',
    },
    {
      title: 'Xem ảnh',
      dataIndex: 'operation',
      width: '15%',
      render: ((_, record) => {
        return (
          <span>
            <Typography.Link onClick={() => onWatchImg(record)}>
              Xem ảnh
            </Typography.Link>
          </span>
        )
      })
    },
  ];
  const onWatchImg = (record) => {
    axios.post('http://113.174.246.52:8082/api/returnInfoID_materialManagerment', {
      id: record.id
    }).then((response) => {
      const img = response.data[0].img
      const name =dataTable.filter(da=>da.id==record.id)[0].name
      setImg(img)
      setName(name)
      showModal(true)
    })
  }
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
  return (
    <>
      <Modal title={name} open={isModalOpen} 
        footer={[
          <Button key="back" onClick={handleOk}>
            Close
          </Button>,
         
        ]}
      >
        <img src={img ? (img) : ''} alt='' className='img-fluid shadow-2-strong' />
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName="editable-row"
          columns={mergedColumns}
          bordered
          size="middle"
          dataSource={dataTable && dataTable}
          scroll={{ x: 'calc(700px + 50%)', y: 500 }}
          pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50', '100'], defaultPageSize: '10' }}
        />
      </Form>
    </>


  )
}
export default TableAnt
//export { columns }
