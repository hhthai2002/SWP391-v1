import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Button from "../../components/button";
import backgroundImage from "../../img/nike.png";
import { useNavigate } from 'react-router-dom';

export default function SignUpServiceCenter() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [address, setAddress] = useState(""); // Thêm state để lưu địa chỉ
  const history = useNavigate();

  async function SignUp() {
    let item = { userName, password, confirmPassword, email, fullName, phone, bankName, bankNumber, address };
    try {
      let response = await fetch('https://localhost:7158/api/Account/RegisterServiceCenter', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Error: ${errorMessage}`);
        alert(errorMessage);
      } else {
        history("/verify");
      }
      const responseData = await response.text();
      console.log(responseData);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <section className="h-screen">
      <div className="h-full flex items-center justify-center">
        <div className="w-1/2">
          <img
            src={backgroundImage}
            className="w-3/4 h-full mx-auto"
            alt="Sample"
          />
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <Form
            name="normal_login"
            className="w-[55%]"
            initialValues={{ remember: true }}
          >
            <h1 className="text-3xl mb-5 text-525252 text-center mt-10">
              Đăng ký trở thành trung tâm
            </h1>
            <div className="mb-2">
              <p>Tài khoản của trung tâm</p>
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Tài khoản của trung tâm!" }]}
            >
              <Input
                type="text"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tài khoản"
                className="py-3"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Mật khẩu</p>
            </div>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
                className="py-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Xác nhận mật khẩu</p>
            </div>
            <Form.Item
              name="confirm-password"
              rules={[{ required: true, message: "Hãy xác nhận mật khẩu!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="py-3"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Email</p>
            </div>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Hãy nhập Email của bạn!" }]}
            >
              <Input
                type="text"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-3"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Tên Trung Tâm</p>
            </div>
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: "Hãy nhập tên trung tâm!" }]}
            >
              <Input
                type="text"
                placeholder="Tên Trung Tâm"
                className="py-3"
                onChange={(e) => setFullname(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Số điện thoại liên hệ</p>
            </div>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "Số điện thoại liên hệ!" }]}
            >
              <Input
                type="text"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Số điện thoại"
                className="py-3"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Tên ngân hàng</p>
            </div>
            <Form.Item
              name="bankName"
              rules={[{ required: true, message: "Hãy nhập tên Ngân Hàng!" }]}
            >
              <Input
                type="text"
                placeholder="Tên ngân hàng"
                className="py-3"
                onChange={(e) => setBankName(e.target.value)}
              />
            </Form.Item>
            <div className="mb-2">
              <p>Số tài khoản ngân hàng</p>
            </div>
            <Form.Item
              name="bankNumber"
              rules={[{ required: true, message: "Hãy nhập số tài khoản ngân hàng!" }]}
            >
              <Input
                type="text"
                placeholder="Số tài khoản ngân hàng"
                className="py-3"
                onChange={(e) => setBankNumber(e.target.value)}
              />
            </Form.Item>

            {/* Thêm phần nhập địa chỉ */}
            <div className="mb-2">
              <p>Địa chỉ trung tâm</p>
            </div>
            <Form.Item
              name="address"
              rules={[{ required: true, message: "Hãy nhập địa chỉ trung tâm!" }]}
            >
              <Input
                type="text"
                placeholder="Địa chỉ trung tâm"
                className="py-3"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="bg-black mt-1 w-full px-2 py-2"
                onClick={SignUp}
              >
                <span className="text-orange-600">Sign Up </span>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}
