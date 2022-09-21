import React from 'react'
import Img from "../../Assets/banner/result.svg"
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { Button, Row, Col, Carousel, Input,notification } from 'antd';
import axios from 'axios';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import 'antd/dist/antd.css';
import '../Styles/login.css'
export default function Login() {
    //trả danh sách hình ảnh trong thư mục server
    function importAll(r) {
        return r.keys().map(r);
    }
    
    const openNotification = () => {
        const args = {
          message: 'Notification Title',
          description:'Vui lòng kiểm tra thông tin đăng nhập',
          duration: 2,
        };
        notification.open(args);
      };
    const handleLongin=(values)=>{
        axios.post("http://113.174.246.52:8082/api/getLogin_materialManagerment",{
            msnv:values.msnv,
            pass:values.pass
        }).then((response)=>{
            const data = response.data
            if(data.length>0){
                localStorage.setItem('user' , JSON.stringify(data[0]['name']))
                localStorage.setItem('msnv' , JSON.stringify(data[0]['msnv']))
                window.location.reload()
            }
            else openNotification()
            
        })
        
    }
    //lấy all img from server folder 
    const images = importAll(require.context('../../Assets/banner/', false, /\.(png|jpe?g|svg)$/));
    
    const formik = useFormik({
        initialValues: {
            msnv: '',
            pass: ''
        },
        validationSchema: Yup.object({
            msnv: Yup
                .string()
                .typeError('Vui lòng nhập kí tự số')
                .required('Vui lòng nhập mã số nhân viên')
                .min(7, 'Vui lòng nhập trên 7 chữ số'),

            pass: Yup
                .string()
                .required('Vui lòng nhập mật khẩu đăng nhập'),
                // .min(8, 'Vui lòng nhập trên 7 chữ số')
                // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Mật khẩu chưa đủ mạnh, vui lòng gõ trên kí tự và có kí tự in hoa hoặc đặc biệt'),
        }),
        onSubmit:(values)=>{
           handleLongin(values)
        }
    })

    return (
        <Row>
            <Col span={20} offset={2}>
                <div className="body">
                    <div className="left-login">
                    <div className='titleLogin' style={{textAlign: 'center', marginTop:'20px'}}> <h1>ỨNG DỤNG QUẢN LÝ KHO VẬT TƯ BẢO TRÌ</h1></div>
                   
                        <Row>
                            <Col span={24} xl={14} className="imgBanner">
                                {/* <img src={Img} alt="Hình minh hoạ" className="banner" /> */}
                                <Carousel autoplay>
                                    {images.map((img,index)=>(
                                        <div key={index}><img src={img} alt="Hình banner" className="banner" /></div>
                                    ))}
                                </Carousel>
                            </Col>
                            <Col span={24} xl={10} className='parentLogin'>

                                <div className='formLogin main'>
                                    <h1 style={{ textAlign: 'center' }}>ĐĂNG NHẬP</h1>
                                    <div className='formLogin userName'>
                                        <label>Tài Khoản</label>
                                        <Input
                                            className='input'
                                            placeholder="Nhập mã số nhân viên"
                                            prefix={<UserOutlined />}
                                            id='msnv'
                                            name='msnv'
                                            value={formik.values.msnv}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.errors.msnv && (<p className='error'>{formik.errors.msnv}</p>)}
                                    </div>
                                    <div className='formLogin passWord'>
                                        <label>Mật khẩu</label>
                                        <Input.Password
                                            className='input'
                                            placeholder="Nhập mật khẩu"
                                            prefix={<KeyOutlined />}
                                            id='pass'
                                            value={formik.values.pass}
                                            onChange={formik.handleChange} />
                                        {formik.errors.pass && (<p className='error'>{formik.errors.pass}</p>)}
                                    </div>
                                    <div className='formLogin submit'>
                                        <Button className='btnSubmit' type="primary" block onClick={formik.handleSubmit}>Login</Button>
                                    </div>
                                </div>

                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
