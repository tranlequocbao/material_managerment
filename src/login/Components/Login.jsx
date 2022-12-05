import React, { useState } from "react";
import Img from "../../Assets/banner/result.svg";
import {
  UserOutlined,
  KeyOutlined,
  LinkedinFilled,
  FieldNumberOutlined,
} from "@ant-design/icons";
import { Button, Row, Col, Carousel, Input, notification } from "antd";
import axios from "axios";
import * as Yup from "yup";
import { useFormik, Form } from "formik";
import "antd/dist/antd.css";
import "../Styles/login.css";
import { motion } from "framer-motion";
export default function Login() {
  //switch signin and Signup
  const [signup, checkSingup] = useState(false);
  const [changePass, setChangPass] = useState(false);
  const initLogin = {
    msnv: "",
    pass: "",
  };
  const initSignup = {
    msnvSignUp: "",
    passSignUp: "",
    passSignUp2: "",
    name: "",
  };
  const initChangePass = {
    msnvChangePass: "",
    passOldChangePass: "",
    passNewChangePass: "",
    passConfirmChangePass: "",
  };
  //trả danh sách hình ảnh trong thư mục server
  function importAll(r) {
    return r.keys().map(r);
  }

  // thông báo
  const openNotification = (status, type) => {
    notification[type]({
      message: "THÔNG BÁO",
      description: status,
    });
  };
  const handleLongin = (values) => {
    axios
      .post("http://113.174.246.52:8082/api/getLogin_materialManagerment", {
        msnv: values.msnv,
        pass: values.pass,
      })
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          localStorage.setItem("user", JSON.stringify(data[0]["name"]));
          localStorage.setItem("msnv", JSON.stringify(data[0]["msnv"]));
          localStorage.setItem("level", JSON.stringify(data[0]["level"]));
          window.location.reload();
        } else
          openNotification("Vui lòng kiểm tra thông tin đăng nhập", "error");
      });
  };
  //lấy all img from server folder
  const images = importAll(
    require.context("../../Assets/banner/", false, /\.(png|jpe?g|svg)$/)
  );

  const formik = useFormik({
    initialValues: initLogin,
    validationSchema: Yup.object({
      msnv: Yup.string()
        .typeError("Vui lòng nhập kí tự số")
        .required("Vui lòng nhập mã số nhân viên")
        .min(7, "Vui lòng nhập trên 7 chữ số"),

      pass: Yup.string().required("Vui lòng nhập mật khẩu đăng nhập"),
      // .min(8, 'Vui lòng nhập trên 7 chữ số')
      // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Mật khẩu chưa đủ mạnh, vui lòng gõ trên kí tự và có kí tự in hoa hoặc đặc biệt'),
    }),
    onSubmit: (values) => {
      handleLongin(values);
    },
  });

  const formikSignUp = useFormik({
    initialValues: initSignup,
    validationSchema: Yup.object({
      msnvSignUp: Yup.string()
        .typeError("Vui lòng nhập kí tự số")
        .required("Vui lòng nhập mã số nhân viên")
        .min(7, "Vui lòng nhập trên 7 chữ số"),

      passSignUp: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Phải trên 8 kí tự, tối thiểu 1 kí tự hoa, thường, số và 1 kí tự đặc biệt (#,$,%,&)"
        ),
      passSignUp2: Yup.string()
        .required("Vui lòng nhập mật khẩu đăng nhập")
        .oneOf(
          [Yup.ref("passSignUp"), null],
          "vui lòng gõ trùng mật khẩu đã nhập"
        ),
      name: Yup.string().required("Vui lòng nhập tên tài khoản"),
    }),
    onSubmit: (values) => {
      handleSignUp(values, "insert");
    },
  });
  const formikChangePass = useFormik({
    initialValues: initChangePass,
    validationSchema: Yup.object({
      msnvChangePass: Yup.string()
        .typeError("Vui lòng nhập kí tự số")
        .required("Vui lòng nhập mã số nhân viên")
        .min(7, "Vui lòng nhập trên 7 chữ số"),

      passOldChangePass: Yup.string().required("Vui lòng nhập mật khẩu"),
      passNewChangePass: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Phải trên 8 kí tự, tối thiểu 1 kí tự hoa, thường, số và 1 kí tự đặc biệt (#,$,%,&)"
        ),
      passConfirmChangePass: Yup.string()
        .required("Vui lòng nhập mật khẩu đăng nhập")
        .oneOf(
          [Yup.ref("passNewChangePass"), null],
          "vui lòng gõ trùng mật khẩu mới đã nhập"
        ),
    }),
    onSubmit: (values) => {
      handleChangePass(values, "changePass");
    },
  });
  const handleSignUp = (values, mode) => {
    const data = {
      msnv: formikSignUp.values.msnvSignUp,
      pass: formikSignUp.values.passSignUp,
      name: formikSignUp.values.name,
      level: "3",
      mode: "insert",
    };
    axios
      .post("http://113.174.246.52:8082/api/modifyUser_materialManagerment", {
        data,
      })
      .then((res) => {
        if (res.data == "exist") {
          openNotification("Đã tồn tại người dùng trong hệ thống", "error");
        } else if (res.data == "updateOK") {
          openNotification(
            "Đã đổi mật khẩu thành công. Vui lòng đăng nhập lại bằng mật khẩu mới!",
            "success"
          );
          checkSingup(false);
        } else if (res.data == "insertOK") {
          openNotification(
            "Đã thêm người dùng mới. Vui lòng đăng nhập để sử dụng ứng dụng!",
            "success"
          );
          checkSingup(false);
          formikSignUp.resetForm();
        } else {
          openNotification(
            "Có lỗi hệ thống xảy ra. Vui lòng liên hệ Admin để hỗ trợ",
            "error"
          );
        }
      });
  };
  const handleChangePass = (values, mode) => {
    if (values.passOldChangePass === values.passNewChangePass) {
      openNotification("Mật khẩu mới không được trùng mật khẩu cũ", "error");
      return false;
    } else {
      const data = {
        msnv: formikChangePass.values.msnvChangePass,
        oldpass: formikChangePass.values.passOldChangePass,
        newpass: formikChangePass.values.passNewChangePass,
        mode: "update",
      };
      axios
        .post("http://113.174.246.52:8082/api/modifyUser_materialManagerment", {
          data,
        })
        .then((res) => {
          if (res.data == "erroruser") {
            openNotification(
              "Không tồn tại người dùng trong hệ thống",
              "error"
            );
          } else if (res.data == "updateOK") {
            openNotification(
              "Đã đổi mật khẩu thành công. Vui lòng đăng nhập lại bằng mật khẩu mới!",
              "success"
            );
            checkSingup(false);
            setChangPass(false);
            formikChangePass.resetForm();
          } else if (res.data == "errorpass") {
            openNotification("Mật khẩu cũ không đúng!", "error");
            checkSingup(false);
          } else {
            openNotification(
              "Có lỗi hệ thống xảy ra. Vui lòng liên hệ Admin để hỗ trợ",
              "error"
            );
          }
        });
    }
  };

  return (
    <Row>
      <Col span={20} offset={2}>
        <div className="body">
          <div className="left-login">
            <div
              className="titleLogin"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <h1>ỨNG DỤNG QUẢN LÝ KHO VẬT TƯ BẢO TRÌ</h1>
            </div>
            <Row>
              <Col span={24} xl={14} className="imgBanner">
                {/* <img src={Img} alt="Hình minh hoạ" className="banner" /> */}
                <Carousel autoplay>
                  {images.map((img, index) => (
                    <div key={index}>
                      <img src={img} alt="Hình banner" className="banner" />
                    </div>
                  ))}
                </Carousel>
              </Col>
              {!signup && !changePass ? (
                <Col span={24} xl={10} className="parentLogin">
                  <motion.div
                    style={{ width: "100%" }}
                    initial={{ x: !signup && !changePass ? -800 : "" }}
                    animate={{ x: !signup && !changePass ? 0 : "" }}
                  >
                    <div className="formLogin main">
                      <h1 style={{ textAlign: "center" }}>ĐĂNG NHẬP</h1>
                      <div className="formLogin userName">
                        <label>Tài Khoản</label>
                        <Input
                          className="input"
                          placeholder="Nhập mã số nhân viên"
                          prefix={<UserOutlined />}
                          id="msnv"
                          name="msnv"
                          value={formik.values.msnv}
                          onChange={formik.handleChange}
                          onPressEnter={formik.handleSubmit}
                        />
                        {formik.errors.msnv && (
                          <p className="error">{formik.errors.msnv}</p>
                        )}
                      </div>
                      <div className="formLogin passWord">
                        <label>Mật khẩu</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập mật khẩu"
                          prefix={<KeyOutlined />}
                          id="pass"
                          value={formik.values.pass}
                          onChange={formik.handleChange}
                          onPressEnter={formik.handleSubmit}
                        />
                        {formik.errors.pass && (
                          <p className="error">{formik.errors.pass}</p>
                        )}
                      </div>
                      <div className="formLogin submit">
                        <Button
                          className="btnSubmit"
                          type="primary"
                          block
                          onClick={formik.handleSubmit}
                        >
                          Đăng Nhập
                        </Button>
                        <a
                          href="#"
                          onClick={() => {
                            checkSingup(true);
                            setChangPass(false);
                          }}
                          className="register"
                        >
                          Đăng Ký
                        </a>
                      </div>
                      <div className="changePass">
                        <a
                          href="#"
                          onClick={() => {
                            setChangPass(true);
                            checkSingup(false);
                          }}
                        >
                          Đổi mật khẩu
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ) : (
                ""
              )}
              {signup && (
                <Col span={24} xl={10} className="parentSignup">
                  <motion.div
                    style={{ width: "100%" }}
                    initial={{ x: -800 }}
                    animate={{ x: 0 }}
                    variants={{ hidden: { opacity: 0, x: 400 } }}
                  >
                    <div className="formSignup main">
                      <h1 style={{ textAlign: "center" }}>ĐĂNG KÝ</h1>
                      <div className="formLogin userName">
                        <label>Mã số nhân viên</label>
                        <Input
                          className="input"
                          placeholder="Nhập mã số nhân viên"
                          prefix={<FieldNumberOutlined />}
                          id="msnvSignUp"
                          name="msnvSignUp"
                          value={formikSignUp.values.msnvSignUp}
                          onChange={formikSignUp.handleChange}
                          onPressEnter={formikSignUp.handleSubmit}
                        />
                        {formikSignUp.errors.msnvSignUp && (
                          <p className="error">
                            {formikSignUp.errors.msnvSignUp}
                          </p>
                        )}
                      </div>
                      <div className="formLogin name">
                        <label>Tên tài khoản</label>
                        <Input
                          className="input"
                          placeholder="Nhập tên tài khoản"
                          prefix={<UserOutlined />}
                          id="name"
                          name="name"
                          value={formikSignUp.values.name}
                          onChange={formikSignUp.handleChange}
                          onPressEnter={formikSignUp.handleSubmit}
                        />
                        {formikSignUp.errors.name && (
                          <p className="error">{formikSignUp.errors.name}</p>
                        )}
                      </div>
                      <div className="formLogin passWord">
                        <label>Mật khẩu</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập mật khẩu"
                          prefix={<KeyOutlined />}
                          id="passSignUp"
                          name="passSignUp"
                          value={formikSignUp.values.passSignUp}
                          onChange={formikSignUp.handleChange}
                          onPressEnter={formikSignUp.handleSubmit}
                        />
                        {formikSignUp.errors.passSignUp && (
                          <p className="error">
                            {formikSignUp.errors.passSignUp}
                          </p>
                        )}
                      </div>

                      <div className="formLogin passWord">
                        <label>Nhập lại mật khẩu</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập lại mật khẩu"
                          prefix={<KeyOutlined />}
                          id="passSignUp2"
                          value={formikSignUp.values.passSignUp2}
                          onChange={formikSignUp.handleChange}
                          onPressEnter={formikSignUp.handleSubmit}
                        />
                        {formikSignUp.errors.passSignUp2 && (
                          <p className="error">
                            {formikSignUp.errors.passSignUp2}
                          </p>
                        )}
                      </div>

                      <div className="formLogin submit">
                        <Button
                          className="btnSubmit"
                          type="primary"
                          block
                          onClick={formikSignUp.handleSubmit}
                        >
                          Đăng Ký
                        </Button>
                        <a
                          href="#"
                          onClick={() => {
                            checkSingup(false);
                            setChangPass(false);
                          }}
                          className="login"
                        >
                          Đăng Nhập
                        </a>
                      </div>
                      <div className="changePass">
                        <a
                          href="#"
                          onClick={() => {
                            setChangPass(true);
                            checkSingup(false);
                          }}
                        >
                          Đổi mật khẩu
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              )}
              {changePass && (
                <Col span={24} xl={10} className="parentChangPass">
                  <motion.div
                    style={{ width: "100%" }}
                    initial={{ x: -800 }}
                    animate={{ x: 0 }}
                  >
                    <div className="formSignup main">
                      <h1 style={{ textAlign: "center" }}>ĐỔI MẬT KHẨU</h1>
                      <div className="formLogin userName">
                        <label>Mã số nhân viên</label>
                        <Input
                          className="input"
                          placeholder="Nhập mã số nhân viên"
                          prefix={<FieldNumberOutlined />}
                          id="msnvChangePass"
                          name="msnvChangePass"
                          value={formikChangePass.values.msnvChangePass}
                          onChange={formikChangePass.handleChange}
                          onPressEnter={formikChangePass.handleSubmit}
                        />
                        {formikChangePass.errors.msnvChangePass && (
                          <p className="error">
                            {formikChangePass.errors.msnvChangePass}
                          </p>
                        )}
                      </div>
                      <div className="formLogin passWord">
                        <label>Mật khẩu cũ</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập mật khẩu cũ"
                          prefix={<KeyOutlined />}
                          id="passOldChangePass"
                          name="passOldChangePass"
                          value={formikChangePass.values.passOldChangePass}
                          onChange={formikChangePass.handleChange}
                          onPressEnter={formikChangePass.handleSubmit}
                        />
                        {formikChangePass.errors.passOldChangePass && (
                          <p className="error">
                            {formikChangePass.errors.passOldChangePass}
                          </p>
                        )}
                      </div>

                      <div className="formLogin passWord">
                        <label>Mật khẩu mới</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập mật khẩu mới"
                          prefix={<KeyOutlined />}
                          id="passNewChangePass"
                          value={formikChangePass.values.passNewChangePass}
                          onChange={formikChangePass.handleChange}
                          onPressEnter={formikChangePass.handleSubmit}
                        />
                        {formikChangePass.errors.passNewChangePass && (
                          <p className="error">
                            {formikChangePass.errors.passNewChangePass}
                          </p>
                        )}
                      </div>

                      <div className="formLogin passWord">
                        <label>Xác nhận mật khẩu mới</label>
                        <Input.Password
                          className="input"
                          placeholder="Nhập mật khẩu mới để xác nhận"
                          prefix={<KeyOutlined />}
                          id="passConfirmChangePass"
                          value={formikChangePass.values.passConfirmChangePass}
                          onChange={formikChangePass.handleChange}
                          onPressEnter={formikChangePass.handleSubmit}
                        />
                        {formikChangePass.errors.passConfirmChangePass && (
                          <p className="error">
                            {formikChangePass.errors.passConfirmChangePass}
                          </p>
                        )}
                      </div>

                      <div className="formLogin submit">
                        <Button
                          className="btnSubmit"
                          type="primary"
                          block
                          onClick={formikChangePass.handleSubmit}
                        >
                          Đổi mật khẩu
                        </Button>
                        <a
                          href="#"
                          onClick={() => {
                            checkSingup(false);
                            setChangPass(false);
                          }}
                          className="login"
                        >
                          Đăng Nhập
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  );
}
