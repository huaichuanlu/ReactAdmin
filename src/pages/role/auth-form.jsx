import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }


    constructor(props) {
        super(props)
        const { menus } = this.props.role

        this.state = {
            treeData: [{
                title: '平台权限',
                key: 'all',
                children: []
            }],
            checkedKeys: menus,
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                {
                    title: item.title,
                    key: item.key,
                    children: item.children ? this.getTreeNodes(item.children) : null
                }
            )
            return pre
        }, [])
    }

    // 为父组件获取最新menus的方法
    getMenus = () => this.state.checkedKeys

    // 选中某个node 
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    };

    // 根据新传入的role来更新checkedKeys状态
    // 当组件接收到新的属性时自动调用
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
        // this.state.checkedKeys = menus
    }


    UNSAFE_componentWillMount() {
        let treeDatas = this.state.treeData
        treeDatas[0].children = this.getTreeNodes(menuList)
        this.setState({
            treeData: treeDatas
        })
    }

    render() {
        const { role } = this.props
        const { treeData, checkedKeys } = this.state
        return (
            <div>
                <Item label='角色名称'>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={{ checked: checkedKeys }}
                    onCheck={this.onCheck}
                    treeData={treeData}
                />
            </div>
        )
    }
}
