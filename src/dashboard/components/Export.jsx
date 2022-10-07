import React from 'react'
import { useState, useContext } from 'react';
import axios from 'axios';
import { MDBInput, MDBContainer, MDBRow, MDBCol, MDBBtn, } from 'mdb-react-ui-kit';
import { AutoComplete, notification, Input, Select } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '../Styles/Export.css'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { UserContext } from './Navbar'
function Export() {
  const { Option } = Select;
  const { dataMaterial } = useContext(UserContext)
  const [img, setImg] = useState('')
  const [uniPrice, setUnitPrice] = useState([])
  var idMaterial = ''
  const initData = {
    id: '',
    name: '',
    unit: '',
    otherName: '',
    amount: 0,
    unitPrice: 0,
    idType: '',
    device: '',
    group: '',
    dept: '',
    supplier: '',
    img: '',
    position: '',
    unit: '',
  }
  //Khơi tạo biến formik
  const formik = useFormik({
    initialValues: initData,
    validationSchema: Yup.object({
      id: Yup.string().required('Vui lòng nhập mã vật tư'),
      name: Yup.string().required('Tên vật tư không để trống'),
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, { resetForm })
    }
  })

  const setOptions = []
  const handleDataAutoCompleteMVT = (dataMaterial) => {
    dataMaterial && dataMaterial.map((val, index) => {
      setOptions.push(
        {
          id: val.id,
          value: val.name
        },
      )
    })
    return setOptions
  }

  // thông báo
  const openNotification = (status, type) => {
    notification[type]({
      message: 'THÔNG BÁO',
      description: status,
    });
  };
  //console.log(img)
  //submit vào csld  
  const handleSubmit = (values, { resetForm }) => {

    formik.values['user'] = JSON.parse(localStorage.getItem('user'))
    axios.post('http://113.174.246.52:8082/api/export_materialManagerment', {
      data: values
    }).then((response) => {
      if (response.data == 'Xuất thành công') {
        openNotification(response.data, 'success')
        resetForm({ values: '' })
      }
      else
        openNotification(response.data, 'error')

    })
  }
  const handleSelectUnitPrice = (values) => {
    var keyprop = uniPrice.indexOf(uniPrice.filter(da=>da.unit_price==values)[0])
    setValueforFormik(keyprop,uniPrice)
  }
  //load thông tin nếu mã id đã tồn tại
  const handleLoadId = () => {
    var id = idMaterial != '' ? idMaterial : formik.values.id

    axios.post('http://113.174.246.52:8082/api/returnInfoID_materialManagerment', {
      id: id
    }).then((response) => {

      const data = response.data
      formik.values = initData

      setUnitPrice(data)
      if (data) {
        setValueforFormik(0, data)
      }
    })
  }

  const setValueforFormik = (key, data) => {
    formik.setFieldValue('id', data[key].id)
    formik.setFieldValue('name', data[key].name)
    formik.setFieldValue('unit', data[key].unit)
    formik.setFieldValue('amount', data[key].amount)
    formik.setFieldValue('unitPrice', data[key].unit_price)
    formik.setFieldValue('idType', data[key].id_type)
    formik.setFieldValue('device', data[key].device)
    formik.setFieldValue('group', data[key].groups_material)
    formik.setFieldValue('dept', data[key].dept)
    formik.setFieldValue('otherName', data[key].other_name)
    formik.setFieldValue('supplier', data[key].supplier)
    data.img && setImg(data[key].img)
    formik.setFieldValue('position', data[key].id_layout)
  }

  const onSelect = (values) => {
    var id = setOptions.find(item => item.value === values)
    idMaterial = id.id
    handleLoadId(id.id)
  }
  return (
    <MDBContainer>
      <MDBRow className='mb-3'>
        <MDBCol className='md'>
          {`Tồn kho: ${formik.values.amount}  `}

          {`Vị trí: ${formik.values.position}`}
        </MDBCol>
      </MDBRow>
      <form onSubmit={formik.handleSubmit}>
        <MDBRow className='mb-3'>
          <MDBCol size='md-2'>
            <MDBInput
              id='id'
              name='id'
              value={formik.values.id}
              onChange={formik.handleChange}
              onBlur={handleLoadId}
              label='Nhập mã số' type='text' size='lg' />
            {formik.errors.id && (<p className='error'>{formik.errors.id}</p>)}
          </MDBCol>

          <MDBCol size='md-8'>
            <AutoComplete
              popupClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              style={{
                width: '100%',
                height: '44.92'
              }}
              options={handleDataAutoCompleteMVT(dataMaterial)}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={onSelect}
              value={formik.values.name}
              
            >
              <Input id='name' name='name' size="large" placeholder="Nhập tên vật tư" />
            </AutoComplete>
          </MDBCol>
          <MDBCol size='md-2'>
            <MDBInput
              id='unit'
              name='unit'
              value={formik.values.unit}
              onChange={formik.handleChange}
              label='Đơn vị' type='text' size='lg'
              disabled={true} />
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-4'>
            <MDBInput
              id='otherName'
              name='otherName'
              value={formik.values.otherName}
              onChange={formik.handleChange}
              label='Tên vật tư rút gọn' type='text' size='lg'
              disabled={true}
            />
          </MDBCol>
          <MDBCol size='md-4'>
            <MDBInput
              id='device'
              name='device'
              value={formik.values.device}
              onChange={formik.handleChange}
              label='Thiết bị' type='text' size='lg'
              disabled={true}
            />
          </MDBCol>
          <MDBCol size='md-4'>
            <MDBInput
              id='idType'
              name='idType'
              value={formik.values.idType}
              onChange={formik.handleChange}
              label='Nhóm vật tư' type='text' size='lg'
              disabled={true}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-6'>
            <MDBInput
              id='supplier'
              name='supplier'
              value={formik.values.supplier}
              onChange={formik.handleChange}
              label='Nhà cung cấp' type='text' size='lg'
              disabled={true} />
          </MDBCol>
          <MDBCol size='md-6'>
            <MDBInput
              id='dept'
              name='dept'
              value={formik.values.dept}
              onChange={formik.handleChange}
              label='Xưởng' type='text' size='lg'
              disabled={true} />
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-2'>
            <MDBInput
              id='amount'
              name='amount'
              value={formik.values.amount}
              onChange={formik.handleChange}
              label='Số lượng' type='text' size='lg'

            />

          </MDBCol>
          <MDBCol size='md-2'>
            <Select
              id='unitPrice'
              name='unitPrice'
              value={formik.values.unitPrice}
              style={{
                height: '100%',
                width: '100%'
              }}
              onChange={handleSelectUnitPrice}
            >
              {uniPrice && uniPrice.map((val, index) => (<Option key={index} value={val.unit_price}>{val.unit_price}</Option>))}

            </Select>
          </MDBCol>
          <MDBCol size='md-2' className='positionLayout'>
            <MDBInput
              id='position'
              name='position'
              value={formik.values.position}
              label='Vị trí' type='text' size='lg'
              disabled={true}
            />
          </MDBCol>
        </MDBRow>


        <MDBRow className='mb-3' >
          <MDBRow className='mb-3' ></MDBRow>
          <MDBCol size='md-12'>
            <div className='d-flex justify-content-center' >
              <div className='img' style={{ width: '50%', height: '50%' }}>
                <img src={img ? (img) : ''} alt='' className='img-fluid shadow-2-strong' />
              </div>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow className='mb-3 ' >
          <MDBCol size='md-12' id='import'>
            <div className='d-flex justify-content-center' >
              <MDBBtn rounded type='submit' className='mx-2' color='primary'
              // onClick={formik.handleSubmit}
              >
                XUẤT KHO
              </MDBBtn>
            </div>

          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  )
}

export default Export