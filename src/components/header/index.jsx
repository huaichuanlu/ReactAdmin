import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { formateDate } from '../../utils/dateUtils'
import { reqWeather } from '../../api'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../linkButton'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './index.less'
/*
左侧导航组件
*/
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        weather: '',
    }
    //获取时间更新
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    //获取天气状态
    getWeather = async () => {
        const { weather } = await reqWeather('长沙')
        //更新状态
        this.setState({ weather })
    }
    //挂载
    componentDidMount() {
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }

    getTitle = () => {
        //获取当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果有值才有匹配的
                if (cItem) {
                    //取出title
                    title = cItem.title
                }
            }
        })
        return title
    }

    //退出登录
    logOut = () => {
        //显示确认框
        Modal.confirm(
            {
                title: '确定退出吗?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                    //删除保存的user数据
                    storageUtils.removeUser()
                    memoryUtils.user = {}
                    //跳转到login页面
                    clearInterval(this.intervalId)
                    this.props.history.replace('/login')
                }
            }
        )
    }

    render() {
        const { currentTime, weather } = this.state
        const user = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{user}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1178787126,2434974534&fm=26&gp=0.jpg" alt="天气" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)