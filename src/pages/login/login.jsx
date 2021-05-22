import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
import './login.less'



const Login = (props) => {

  //如果用户已经登录，自动跳转到管理界面
  const user = memoryUtils.user
  if (user && user._id) {
    return <Redirect to='/'/>
  }

  //点击登录的回调函数
  const onFinish = async (values) => {
    const { username, password } = values
    //发送axios请求 返回的是一个Promise对象，必须用Promise接收
    //需要给一个await来进行来等待接收
    //最后需要在方法边上添加一个async方法
    const result = await reqLogin(username, password)
    if (result.status === 0) {//登录成功
      //显示登录成功
      message.success('登录成功!')
      //将登录的信息保存在内存中
      const user = result.data
      memoryUtils.user = user
      //同时将数据保存在local(主机)中
      storageUtils.saveUser(user)
      //跳转管理界面
      props.history.replace('/')
      //console.log(props.history);
    } else {//登录失败
      message.error(result.msg)
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="" />
        <h1>React项目：后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            // 声明式验证：直接使用别人定义好的验证规则进行验证
            rules={[
              { required: true, whitespace: true, message: '请输入用户名!' },
              { min: 4, message: '用户名最少4位' },
              { max: 12, message: '用户名最多12位' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文 数字或者下划线组成' },
            ]}
          >
            <Input prefix={<UserOutlined
              className="site-form-item-icon" />}
              placeholder="用户名"
              style={{ color: 'rgba(0,0,0,0.25)' }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              style={{ color: 'rgba(0,0,0,0.25)' }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
        </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )
}



export default Login