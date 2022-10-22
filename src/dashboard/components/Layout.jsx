import React, { useEffect, useState } from 'react'
import { Col, Divider, Row, Button, Tooltip, Modal, Input, notification } from 'antd';
import '../Styles/Layout.css'
import axios from 'axios';
import { AppstoreAddOutlined, DownloadOutlined } from '@ant-design/icons'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ButtonGroup } from 'react-bootstrap';

function Layouts() {

    const [data, setData] = useState([])
    const [array, setArray] = useState([])
    const [extendInfoLayout, setExtendInfoLayout] = useState(true)
    const [checkExtend,setCheckExtend]=useState('')
    const name = []
    var idMaterial = '';
    var arrayIDMaterial = new Array([])
    var idMaterial_ = []
    const [modal, setModal] = useState(false);
    const style = {
        background: 'rgb(19, 99, 223)',
        color: 'white',
        borderRadius: '30px',
        width: 'fit-content',
        margin: 'auto',
        padding: '5px',
    };

    useEffect(() => {
        getData()
        data && data.map((val, i) => {
            if (lenght === i + 1) {
                if (val.id_position === idMaterial) {
                    idMaterial_.push(val.id_material)
                    arrayIDMaterial[`${val.id_position}`] = idMaterial_
                }
                else {
                    arrayIDMaterial[idMaterial] = idMaterial_
                    idMaterial_ = []
                    idMaterial_.push(val.id_material)
                    arrayIDMaterial[`${val.id_position}`] = idMaterial_
                }
                return true;
            }
            if (val.id_position === idMaterial) {
                idMaterial_.push(val.id_material)
            }
            else {
                arrayIDMaterial[`${idMaterial}`] = idMaterial_
                idMaterial = val.id_position
                idMaterial_ = []
                idMaterial_.push(val.id_material)
            }
        }
        )
        delete arrayIDMaterial[0]
        delete arrayIDMaterial[""]
        setArray(arrayIDMaterial)
    }, [data])

    function getData() {
        console.log('aaa')
        axios.post('http://113.174.246.52:8082/api/returnInfoLayout_materialManagerment')
            .then((res) => {
                const database = res.data
                const sameArray = JSON.stringify(database) === JSON.stringify(data);
                if (sameArray == false) {
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
        },
        validationSchema: Yup.object({
            id: Yup.string().required('Vui lòng nhập mã vị trí'),
        }),
        onSubmit: (values,) => {
            handleSubmit(values,)
        }
    })
    const handleSubmit = (id) => {
        const data = formik.values
        axios.post('http://113.174.246.52:8082/api/importLayout_materialManagerment', { data }).then((res) => {
            if (res.data['errno']) {
                openNotification("THÊM DỮ LIỆU THẤT BẠI \n Vui lòng xem lại dữ liệu thêm vào", 'error',)
            }
            else {
                openNotification("THÊM DỮ LIỆU THÀNH CÔNG", 'success',)
                setModal(false)
                formik.values.id = '';
                setData('')
            }
        }
        )
    }
    const returnIdMaterial = (data) => {
        const result = []

        for (var key in data) {
            result.push(
                <Tooltip key={key} placement="right" title={name[data[key]]} arrowPointAtCenter>
                    <div style={style} className='mb-2'>
                        {data[key]}
                    </div>
                </Tooltip>
            )
        }
        return result
    }
    var lenght = data.length

    const returnName = (data) => {

        for (var key in data) {
            name[data[key]['id_material']] = data[key]['name']
        }
    }
    data && returnName(data)
    const handleExtendInfoLayout = (event) => {
        if(extendInfoLayout===true){
            setCheckExtend(event.currentTarget.id)
            setExtendInfoLayout(false)
        }
      
       else{
        setCheckExtend('')
        setExtendInfoLayout(true)
       }
    }
    
    const resultLayout = (data) => {
        const resut = []

        for (var key of Object.keys(data)) {
           
            resut.push(
                <Col key={key} className="gutter-row" span={4} >
                
                    <div className='cell'>
                        <div>Vị trí: {key}</div>
                        <Button type="primary" id={key} shape="round" icon={<DownloadOutlined />} size={'large'} onClick={handleExtendInfoLayout}>
                            
                        </Button>
                        <div className={checkExtend===key?'':'hide'}>
                                {data&&returnIdMaterial(data[key])}
                        </div>
                    </div>
                </Col>
            )
        }
        return resut
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
                    resultLayout(array)
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