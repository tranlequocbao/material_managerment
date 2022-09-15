import React from 'react'
import { useState } from 'react';
import { MDBInput, MDBContainer, MDBRow, MDBCol, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '../Styles/Import.css'
function Import() {
  const { Option } = Select;
  const [img, setImg] = useState()
  const handleUpload = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file)
    setImg(file)
  }
  return (
    <MDBContainer>
      <MDBRow className='mb-3'>
        <MDBCol size='md-2'>
          <MDBInput label='Nhập mã số' type='text' size='lg' />
        </MDBCol>
        <MDBCol size='md-8'>
          <MDBInput label='Nhập tên vật tư' type='text' size='lg' />
        </MDBCol>
        <MDBCol size='md-2'>
          <Select
            defaultValue="Cái"
            style={{
              width:'100%',
              height:'100%',  
              marginRight:'20px'
              
            }}
            // onChange={handleChange}
          >
            <Option value="bich">Bịch</Option>
            <Option value="Binh">Bình</Option>
            <Option value="Bo">Bô</Option>
          </Select>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-3'>
        <MDBCol size='md-4'>
          <MDBInput label='Tên vật tư rút gọn' type='text' size='lg' />
        </MDBCol>
        <MDBCol size='md-4'>
          <MDBInput label='Thiết bị' type='text' size='lg' />
        </MDBCol>
        <MDBCol size='md-4'>
          <MDBInput label='Nhóm vật tư' type='text' size='lg' />
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-3'>
        <MDBCol size='md-6'>
          <MDBInput label='Nhà cung cấp' type='text' size='lg' />
        </MDBCol>
        <MDBCol size='md-6'>
          <MDBInput label='Xưởng' type='text' size='lg' />
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-3'>
        <MDBCol size='md-8'>
          <MDBInputGroup
            className='mb-3'
            textBefore='Tải ảnh lên'
            textTag='label'
            textProps={{ htmlFor: 'inputGroupFile01' }}
          >
            <input className='form-control' type='file' id='inputGroupFile01' accept="image/*" onChange={handleUpload} />
          </MDBInputGroup>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-3' >
        <MDBCol size='md-12'>
          <div className='d-flex justify-content-center' >
            <div className='img' style={{ width: '50%', height: '50%' }}>
              <img src={img && (img.preview)} alt='' className='img-fluid shadow-2-strong' />
            </div>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-3 ' >
        <MDBCol size='md-12' id='import'>
          <div className='d-flex justify-content-center' >
            <MDBBtn rounded className='mx-2' color='primary'  >
              NHẬP KHO
            </MDBBtn>
          </div>

        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default Import