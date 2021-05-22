import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { reqCategorys, reqUpdateCategorys, reqAddCategorys } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import LinkButton from '../../components/linkButton'

export default class Category extends Component {

    state = {
        loading: false,
        categorys: [],   //一级分类列表
        subCategorys: [],//二级分类列表
        parentId: '0',   //显示分类列表的id
        parentName: '',  //显示分类父列表的名称
        showStatus: 0,   //标识添加/更新的确认框是否显示,0:都不显示  1:显示添加  2:显示更新
    }

    //初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name'//指定显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (//指定返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数,并传入数据 */}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ];
    }

    //异步获取一级分类列表展示
    getCategorys = async (parentId) => {
        //请求前显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        //请求后显示隐藏loading
        this.setState({ loading: false })
        if (result.status === 0) {
            //取出分类数组(可能是一级，也可能是二级列表)
            const categorys = result.data
            if (parentId === '0') {
                //更新一级分类列表
                this.setState({ categorys })
            } else {
                //更新二级分类列表
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    //显示二级分类列表
    showSubCategorys = (category) => {
        //先更新状态
        this.setState({ parentId: category._id, parentName: category.name }, () => {
            //获取二级分类列表
            this.getCategorys()
        })
    }

    //点击跳转一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    //响应点击取消：隐藏确定框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 添加分类
    addCategory = () => {
        // 进行表单验证
        this.form.validateFields().then(async (values) => {
            // 隐藏确认框
            this.setState({ showStatus: 0 })
            // 收集数据并提交添加分类请求
            const { parentId, categoryName } = values
            // 清除输入数据
            this.form.resetFields()
            const result = await reqAddCategorys(categoryName, parentId)
            if (result.status === 0) {
                // 代表成功
                message.success('添加成功')
                // 添加的分类就是当前分类列表下的分类
                if (parentId === this.state.parentId) {
                    // 重新获取当前分类列表显示
                    this.getCategorys()
                } else if (parentId === '0') {
                    // 在二级分类列表下添加一级分类 重新获取一级分类列表 但是不需要显示一级列表
                    this.getCategorys('0')
                }
            }
        })
    }

    //显示修改的确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({ showStatus: 2 })
    }

    //更新分类
    updateCategory = () => {
        // 进行表单验证 只有通过才能验证
        this.form.validateFields().then(async (values) => {
            this.setState({
                showStatus: 0
            })
            const categoryId = this.category._id
            const { categoryName } = values
            this.form.resetFields()
            const result = await reqUpdateCategorys({ categoryId, categoryName })
            if (result.status === 0) {
                message.success('修改成功!')
                // 3. 重新显示列表
                this.getCategorys()
            }
        }).catch(errorInfo => {
            message.error('请按照指示输入正确的信息')
        });
    }
    //为第一次render准备数据
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    //执行异步任务：发送异步ajax请求
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        //读取状态数据
        const { categorys, parentId, subCategorys, loading, parentName, showStatus } = this.state
        //读取指定分类
        const category = this.category || {}

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表
                <ArrowRightOutlined style={{ marginRight: 5 }} />
                </LinkButton>
                <span>{parentName}</span>
            </span>)
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table rowKey="_id" bordered
                    loading={loading}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ showQuickJumper: true }} />
                <Modal title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}>
                    <AddForm categorys={categorys} parentId={parentId}
                        setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}>
                    <UpdateForm categoryName={category}
                        setForm={(form) => { this.form = form }} />
                </Modal>
            </Card>
        )
    }
}
