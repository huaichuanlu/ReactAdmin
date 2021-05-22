import React, { Component } from 'react'
import { Card, Button, Table, message } from 'antd'
import {  reqRoles, reqUpdateRole,reqAddRole } from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import Modal from 'antd/lib/modal/Modal'
import AddForm from './add-form'
import AuthForm from './auth-form'
/*
角色管理
*/
export default class Role extends Component {

    state = {
        roles: [], //所有角色的列表
        role: {},    //选中的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false
    }

    constructor(props) {
        super(props)
        //创建一个容器
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            }, {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            }, {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    onRow = (Role) => {
        return {
            onClick: event => {
                this.setState({
                    Role
                })
            }
        }
    }

    addRole = () => {
        //表单验证
        this.form.validateFields().then(async (values) => {
            const { roleName } = values
            this.form.resetFields()
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                // 新产生的角色
                const role = result.data
                message.error(`添加角色${role.roleName}成功`)
                // 更新roles状态  更新后的数据和之前的状态数据有关
                this.setState(state => ({
                    roles: [...state.roles, role]
                }))
            } else {
                message.error('添加角色失败')
            }
        }).catch(err => {
            alert('带星号的选项必须输入！')
        });
    }

    //取消添加角色的回调
    handleCancel = () => {
        this.form.resetFields()
        this.setState({ isShowAdd: false })
    }

    // 更新角色的回调函数
    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        //role.auth_name = this.props.user.username

        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            // 如果当前更新的是自己角色的权限 需要强制退出
            if (role._id === memoryUtils.user.role_id) {
                // 清空本地存储
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('用户权限已更新,请重新登录!')
            } else {
                message.success('设置权限成功')
                // 获取显示列表的两种方式
                // this.getRoles()
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button> &nbsp;
                <Button type='primary' disabled={!role._id}
                    onClick={() => { this.setState({ isShowAuth: true }) }}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id], onSelect: (role) => { this.setState({ role }) } }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => { this.setState({ isShowAdd: false }) }}
                >
                    <AddForm setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => { this.setState({ isShowAuth: false }) }}
                >
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}
