import React from 'react'
import Img from "../../Assets/result.svg"
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { Button, Row, Col, Carousel, Input } from 'antd';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import 'antd/dist/antd.css';
import '../Styles/login.css'
export default function Login() {
  
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
                .required('Vui lòng nhập mã số nhân viên')
                .min(8, 'Vui lòng nhập trên 7 chữ số')
                .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Mật khẩu chưa đủ mạnh, vui lòng gõ trên kí tự và có kí tự in hoa hoặc đặc biệt'),
        }),
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return (
        <Row>
            <Col span={20} offset={2}>
                <div className="body">
                    <div className="left-login">

                        <Row>
                            <Col span={24} xl={14}>
                                <img src={Img} alt="Hình minh hoạ" className="banner" />
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
