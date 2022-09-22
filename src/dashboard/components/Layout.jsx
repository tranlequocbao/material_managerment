import React, { useEffect, useState } from 'react'
import { Col, Divider, Row, Button, Tooltip, Modal, Input, notification} from 'antd';
import '../Styles/Layout.css'
import axios from 'axios';
import { AppstoreAddOutlined } from '@ant-design/icons'
import { useFormik } from 'formik';
import * as Yup from 'yup'

function Layouts() {

    const [data, setData] = useState([])
    const [modal, setModal] = useState(false);
    const style = {
        background: 'rgb(19, 99, 223)',
        padding: '8px 0',
        color: 'white',
        borderRadius: '30px',
        width: 'fit-content',
        margin: 'auto',
        padding: '5px',
    };

    React.useEffect(() => {
        getData()
    }, [data])

    function getData() {
        axios.post('http://113.174.246.52:8082/api/returnInfoLayout_materialManagerment')
            .then((res) => {
                const database = res.data
                if(data===database){
                    console.log(data)
                    console.log(database)
                   
                }
                else{
                    setData(database)
                }
            
                
            }
            )
    }
  // thông báo 
  const openNotification = (status, type) => {
    notification[type]({
      message: 'THÔNG BÁO',
      description: status,
    });
  };
    //khởi tạo biến formik
    const formik = useFormik({
        initialValues: {
            id: ''
        }
        ,
        validationSchema: Yup.object({
            id: Yup.string().required('Vui lòng nhập mã vị trí'),
        }),
        onSubmit: (values,) => {
            handleSubmit(values,)
        }
    })
    const handleSubmit = (id) => {
        const data=formik.values
       axios.post('http://113.174.246.52:8082/api/importLayout_materialManagerment',{data}).then((res)=>{
        if (res.data['errno']) {
            openNotification("THÊM DỮ LIỆU THẤT BẠI \n Vui lòng xem lại dữ liệu thêm vào", 'error',)
          }
          else {
            openNotification("THÊM DỮ LIỆU THÀNH CÔNG", 'success',)
            setModal(false)
            formik.values.id='';
            setData('')
          }
       }
       )
    }
    return (
        <div>
            <Divider orientation="left">LAYOUT KHO BẢO TRÌ XƯỞNG SƠN</Divider>

            <Row
                gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                }}
            >
                {
                    data && data.map((val, index) =>
                        <Col key={index} className="gutter-row" span={4} >
                            <div className='cell'>
                                <div>Vị trí: {val.id}</div>
                                <Tooltip placement="right" title={val.name} arrowPointAtCenter>
                                    <div style={style}>
                                        {val.id_material}

                                    </div>
                                </Tooltip>
                            </div>
                        </Col>
                    )

                }
                <Col className="gutter-row" span={4} >
                    <div className='cell'>
                        Thêm vị trí:
                        <Button type="primary" shape="circle" icon={<AppstoreAddOutlined />} style={{ marginLeft: '10px' }} onClick={() => setModal(true)} />
                    </div>
                </Col>
                <Modal
                    title="Thêm vị trí"
                    centered
                    open={modal}
                    onOk={formik.handleSubmit}
                    onCancel={() => setModal(false)}
                >
                    <Row>
                        <Col span={20} offset={2}>
                            <label htmlFor='id'>Nhập mã vị trí: </label>
                            <Input id='id' name='id' value={formik.values.id} onChange={formik.handleChange}></Input>
                           
                        </Col>
                    </Row>

                </Modal>
            </Row>

        </div>
    )
}

export default Layouts