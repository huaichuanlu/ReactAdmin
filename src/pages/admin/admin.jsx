import React, { Component } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import { Route } from 'react-router-dom/cjs/react-router-dom.min';

const { Footer, Sider, Content } = Layout;


class Admin extends Component {
    render() {
        const user = memoryUtils.user

        //如果内存中没存储user，说明当前没登录
        if (!user || !user._id) {
            //自动跳转登录界面
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20 , backgroundColor: '#fff' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect  to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#cccccc' }}>CopyRight:LHC  (推荐使用谷歌浏览器，效果更佳)</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default Admin