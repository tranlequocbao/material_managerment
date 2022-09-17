import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { MDBInput, MDBContainer, MDBRow, MDBCol, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import { Select, notification } from 'antd';
import 'antd/dist/antd.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '../Styles/Import.css'
import { useFormik } from 'formik';
import * as Yup from 'yup'
function Import() {
  const { Option } = Select;
  const [img, setImg] = useState('')
  const [unit, setUnit] = useState("Bộ")
  const [status, setStatus] = useState('insert')
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
    img: ''
  }
  //Khơi tạo biến formik
  const formik = useFormik({
    initialValues: initData,
    validationSchema: Yup.object({
      id: Yup.string().required('Vui lòng nhập mã vật tư'),
      name: Yup.string().required('Tên vật tư không để trống'),
      amount: Yup.number().required('Nhập số lượng vào dùm')
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, { resetForm })
    }
  })


  // thông báo 
  const openNotification = (status, type) => {
    notification[type]({
      message: 'THÔNG BÁO',
      description: status,
    });
  };



  //submit vào csld
  const handleSubmit = (values, { resetForm }) => {

    formik.values['unit'] = unit;
    if (img)
      formik.values['img'] = img.preview;

    let data = formik.values
    if (status == 'insert') {
      axios.post('http://10.40.12.4:3001/api/import_materialManagerment', {
        data: data
      }).then((response) => {
        if (response.data['errno']) {
          openNotification("THÊM DỮ LIỆU THẤT BẠI", 'error',)
        }
        else {
          openNotification("THÊM DỮ LIỆU THÀNH CÔNG", 'success',)
          setImg('')
          resetForm({ values: '' })

        }
      })
    }
    else if (status == 'update') {

    }



  }
  // get value select
  const handleSelect = (values) => {
    setUnit(values)
  }


  //load thông tin nếu mã id đã tồn tại
  const handleLoadId = () => {
    if(formik.values.id!=''){
      axios.post('http://10.40.12.4:3001/api/returnInfoID_materialManagerment', {
        id: formik.values.id
      }).then((response) => {
        
        const data = response.data[0]
        
        if(data){
          console.log(data)
          formik.setFieldValue('name',data.name)
          setUnit(data.unit)
          formik.setFieldValue('amount',data.amount)
          formik.setFieldValue('initPrice',data.unit_price)
          formik.setFieldValue('idType',data.id_type)
          formik.setFieldValue('device',data.device)
          formik.setFieldValue('group',data.groups_material)
          formik.setFieldValue('dept',data.dept)
          formik.setFieldValue('otherName',data.other_name)
          formik.setFieldValue('supplier',data.supplier)
          data.img &&setImg(data.img)
          console.log(img)
        }
      })
    }

  }

  //load hình cho vật tư
  const handleUpload = (e) => {

    if (e.target.files.length != 0) {
      const file = e.target.files[0];
      console.log(file)
      file.preview = URL.createObjectURL(file)
      setImg(file)
    }
    else setImg('')

  }


  return (
    <MDBContainer>
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
            <MDBInput
              id='name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              label='Nhập tên vật tư' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-2'>
            <div className='unit'>
              {<Select
                id='unit'
                name='unit'
                value={unit}
                style={{
                  height: '100%',
                  width: '100%'
                }}
                onChange={handleSelect}
              >
                <Option value="bich">Bịch</Option>
                <Option value="Binh">Bình</Option>
                <Option value="Bo">Bô</Option>
                <Option value="cai">Cái</Option>
              </Select>
              }
            </div>

          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-4'>
            <MDBInput
              id='otherName'
              name='otherName'
              value={formik.values.otherName}
              onChange={formik.handleChange}
              label='Tên vật tư rút gọn' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-4'>
            <MDBInput
              id='device'
              name='device'
              value={formik.values.device}
              onChange={formik.handleChange}
              label='Thiết bị' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-4'>
            <MDBInput
              id='idType'
              name='idType'
              value={formik.values.idType}
              onChange={formik.handleChange}
              label='Nhóm vật tư' type='text' size='lg' />
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-6'>
            <MDBInput
              id='supplier'
              name='supplier'
              value={formik.values.supplier}
              onChange={formik.handleChange}
              label='Nhà cung cấp' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-6'>
            <MDBInput
              id='dept'
              name='dept'
              value={formik.values.dept}
              label='Xưởng' type='text' size='lg' />
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>
          <MDBCol size='md-2'>
            <MDBInput
              id='amount'
              name='amount'
              value={formik.values.amount}
              onChange={formik.handleChange}
              label='Số lượng' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-2'>
            <MDBInput
              id='unitPirce'
              name='unitPrice'
              value={formik.values.unitPrice}
              onChange={formik.handleChange}
              label='Đơn giá' type='text' size='lg' />
          </MDBCol>
          <MDBCol size='md-8'>
            <div className='upload'>
              <input type="file" className="form-control" accept="image/*;capture=camera" onChange={handleUpload} id="customFile" />
            </div>

          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3'>

        </MDBRow>

        <MDBRow className='mb-3' >
          <MDBRow className='mb-3' ></MDBRow>
          <MDBCol size='md-12'>
            <div className='d-flex justify-content-center' >
              <div className='img' style={{ width: '50%', height: '50%' }}>
                <img src={img ? (img.preview) : ''} alt='' className='img-fluid shadow-2-strong' />
              </div>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-3 ' >
          <MDBCol size='md-12' id='import'>
            <div className='d-flex justify-content-center' >
              <MDBBtn rounded type='submit' className='mx-2' color='primary'

              //onClick={formik.handleSubmit} 
              >
                NHẬP KHO
              </MDBBtn>
            </div>

          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  )
}

export default Import