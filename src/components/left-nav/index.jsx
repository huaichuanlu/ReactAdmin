import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig';
import './index.less'
/*
左侧导航组件
*/
const { SubMenu } = Menu;
class leftNav extends Component {
    state = {
        collapsed: false,
    };
    //#region 递归调用
    /*getMenuNodes = (menuList) => {
        
        根据munu的数据数组生成对应的标签数组
        

        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return <SubMenu key={item.key}
                    title={
                        <span>
                            {item.icon}
                            <span>{item.title}</span>
                        </span>
                    }>
                    {
                        this.getMenuNodes(item.children)
                    }
                </SubMenu>
            }
        })
        //#endregion
    }*/

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            //向pre中添加<Menu.Item>
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {

                //查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果存在，说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }
                //向pre中添加<SubMenu>
                pre.push((
                    <SubMenu key={item.key}
                        title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                        }>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
            }

            return pre
        }, [])
    }

    //第一次render()之前执行一次  为第一次render()渲染做准备数据
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {

        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) {
            // 说明现在显示 product或者product的子页面
            // 修改path
            path = '/product'
          }
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>XX后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultSelectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(leftNav)
