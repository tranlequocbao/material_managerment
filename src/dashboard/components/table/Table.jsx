import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Form, Row, Col,notification } from 'antd';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';

var columns = []
function TableAnt(props) {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  // thông báo
  const openNotification = (status, type) => {
    notification[type]({
      message: 'THÔNG BÁO',
      description: status,
    });
  };
  //using formik for modify value of table exist
  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      unit: '',
      otherName: '',
      device: '',
      groupsMaterial: '',
      dept: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Vui lòng nhập tên vật tư'),
      unit: Yup.string().required('Vui lòng nhập đơn vị'),

    }),
    onSubmit: (values) => {
      onSubmitModify(values)
    }
  })
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSubmitModify = (values) => {
   
    axios.post('http://113.174.246.52:8082/api/modifyInfo_materialManagerment',{values})
    .then((res)=>{
      if (res.data['errno']) {
        openNotification("THÊM DỮ LIỆU THẤT BẠI", 'error',)
      }
      else window.location.reload()
    })
  }
  const handleModify = (values) => {
    formik.values.id = values.id
    formik.values.name = values.name
    formik.values.unit = values.unit
    formik.values.otherName = values.other_name
    formik.values.device = values.device
    formik.values.groupsMaterial = values.groups_material
    formik.values.dept = values.dept
    setIsModalOpen(true);
  }

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
    {
      title: 'Sửa Thông tin',
      key: 'action',
      width: '5%',
      render: (_, record) => (
        <Button onClick={() => handleModify(record)}>Sửa</Button>
      ),
    },

  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={props.value}
        scroll={{ x: 'calc(700px + 50%)', y: 500 }}
        pagination={{ showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50', '100'], defaultPageSize: '10' }}
      />;
      <Modal title="Hiệu chỉnh thông tin" open={isModalOpen} onOk={formik.handleSubmit} onCancel={handleCancel}>
        <Row>
          <Col span={20} offset={2}>
            <div className="body">

              <Row>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{
                    display: 'flex',
                    width:'100%'
                  }}

                >
                  <Col span={24}  >
                    <label>Mã vật tư</label>
                    <Input
                      className='mdId'
                      id='id'
                      name='id'
                      value={formik.values.id}
                      disabled
                    />
                  </Col>
                  <Col span={24}  >
                    <label>Mật khẩu</label>
                    <Input
                      className='mdName'
                      placeholder="Tên vật tư"
                      id='name'
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      style={{
                    display: 'flex',
                    width:'100%'
                  }}
                    />
                    {formik.errors.name && (<p className='error'>{formik.errors.name}</p>)}
                  </Col>
                  <Col span={24}  >
                    <label>Đơn vị</label>
                    <Input
                      className='mdUnit'
                      id='unit'
                      name='unit'
                      placeholder="Đơn vị tính"
                      value={formik.values.unit}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.unit && (<p className='error'>{formik.errors.unit}</p>)}
                  </Col>
                  <Col span={24} >
                    <label>Tên vật tư rút gọn</label>
                    <Input
                      className='mdUnit'
                      id='otherName'
                      name='otherName'
                      placeholder="Tên vật tư rút gọn"
                      value={formik.values.otherName}
                      onChange={formik.handleChange}
                    />
                  </Col>
                  <Col span={24} >
                    <label>Thiết bị</label>
                    <Input
                      className='mdDevice'
                      id='device'
                      name='device'
                      placeholder="Tên thiết bị"
                      value={formik.values.device}
                      onChange={formik.handleChange}
                    />
                  </Col>
                  <Col span={24}  >
                    <label>Nhóm vật tư</label>
                    <Input
                      className='mdGroupMaterial'
                      id='groupsMaterial'
                      name='groupsMaterial'
                      placeholder="Tên nhóm vật tư"
                      value={formik.values.groupsMaterial}
                      onChange={formik.handleChange}
                    />
                  </Col>
                  <Col span={24}  >
                    <label>Bộ phận</label>
                    <Input
                      className='mdDept'
                      id='dept'
                      name='dept'
                      placeholder="Tên bộ phận"
                      value={formik.values.dept}
                      onChange={formik.handleChange}
                    />
                  </Col>
                </Space>
              </Row>
            </div>
          </Col>
        </Row>
      </Modal>
    </>)
}

export default TableAnt
export { columns }