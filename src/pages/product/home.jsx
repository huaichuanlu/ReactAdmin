import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import LinkButton from "../../components/linkButton";
import { PAGE_SIZE } from '../../utils/constants';
const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        total: 0,    //商品总数量
        products: [], //商品数组
        loading: false,
        searchName: '',//搜索的关键字  用于绑定监听
        searchType: 'productName',//根据哪个字段搜索
    }
    初始化table列的数组
    initColumns = () => {
        this.columns = [{
            title: '商品名称',
            dataIndex: 'name',
        }, {
            title: '商品描述',
            dataIndex: 'desc',
        }, {
            title: '价格',
            dataIndex: 'price',
            render: (price) => '$' + price
        }, {
            width: 100,
            title: '状态',
            //dataIndex: 'status',
            render: (product) => {
                const { status, _id } = product
                return (
                    <span>
                        <Button
                            onClick={() => { this.updateStatus(_id, status === 1 ? 2 : 1) }}
                            type="primary" >{status === 1 ? '下架' : '上架'}</Button>
                        <span>{status === 1 ? '在售' : '已下架'}</span>
                    </span>
                )
            }
        }, {
            width: 100,
            title: '操作',
            render: (product) => {
                return (
                    <span>
                        <LinkButton onClick={() => { this.props.history.push('/product/detail', { product }) }}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                    </span>
                )
            }
        }]
    }

    //获取指定页码列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({ loading: true })
        const { searchName, searchType } = this.state
        let result
        //搜索关键字有值，则进行搜索分页
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false })
        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            this.setState({ total, products: list })
        }
    }

    //更新指定商品状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新成功')
            //更新列表显示
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }
    render() {

        //取出状态数据
        const { products, total, loading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select value={searchType} style={{ width: '150px' }} onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='请输入关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })} />
                <Button type='primary' onClick={() => { this.getProducts(1) }}>搜索</Button>
            </span>)
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>)

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total: total,
                        onChange: this.getProducts
                    }} />
            </Card>
        )
    }
}
