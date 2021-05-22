import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import LinkButton from '../../components/linkButton'
import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input

export default class ProductAddUpdate extends Component {
    formRef = React.createRef();

    state = {
        options: [],
    }
    constructor(props) {
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    // 更新options数组
    initOptions = async (categorys) => {
        // 根据categorys 生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,  //不是叶子 即还有其他子集分类
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取相应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 找到当前商品相应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到对应的一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({ options })
    }

    // 用于异步获取一级/二级分类列表 并且显示
    // async函数的返回值就是一个新的promise对象 promise的结果和值由async的结果决定

    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            // 判断 一级列表还是二级列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                // 二级列表
                // 返回二级列表 ===> 当前async函数返回的promise就会成功且value为categorys
                return categorys
            }
        }
    }

    // 定义验证价格的函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            // callback()  //验证通过
            return Promise.resolve()
        } else {
            // 验证不通过
            // callback('价格必须要大于0！')  会有警告 返回一个promise
            return Promise.reject('价格必须要大于0！')
        }
    }

    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到点击的列表项 即option对象
        const targetOption = selectedOptions[0]
        // 显示loading效果
        targetOption.loading = true

        // 根据选中的分类 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false

        if (subCategorys && subCategorys.length > 0) {
            // 说明现在存在二级分类
            // 生成一个二级列表的options单
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联到当前的target.option身上 ===> children
            targetOption.children = cOptions
        } else {
            // 当前选中的列表项没有二级分类
            targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })
    }

    submit = () => {
        // 进行表单验证 通过才发送请求
        this.formRef.current.validateFields().then(async values => {
            const { name, desc, price, categoryIds } = values
            let pCategoryId, categoryId
            //一级分类
            if (categoryIds.length === 1) {
                pCategoryId = '0'
                categoryId = categoryIds[0]
            } else {
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
            const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
            // 如果是更新, 需要添加_id
            if (this.isUpdate) {
                product._id = this.product._id
            }
            const result = await reqAddOrUpdateProduct(product)
            if (result.status === 0) {
                message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                this.props.history.goBack()
            } else {
                message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
            }
        }).catch(errorInfo => {

        });
    }

    componentDidMount() {
        this.getCategorys('0')  //获取一级列表
    }

    UNSAFE_componentWillMount() {
        // 如果是添加则会没值 否则有值
        const product = this.props.location.state
        // 保存是否为更新的标识  
        this.isUpdate = !!product  //强制转换为一个布尔值
        // 保存商品 若没有 保存一个空对象 则下面设置初始值则不会报错
        this.product = product || {}
    }

    render() {

        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 8 }
        }
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product

        // 用来接收级联分类ID的数组
        const categorys = []
        if (isUpdate) {
            // 商品处于一级分类列表中
            if (pCategoryId === '0') {
                categorys.push(categoryId)
            } else {
                // 商品为二级分类
                categorys.push(pCategoryId)
                categorys.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form ref={this.formRef} {...formItemLayout}>
                    <Item name='name' initialValue={product.name} rules={[
                        { required: true, message: '必须输入商品名称' },
                    ]} label="商品名称">
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item name='desc' initialValue={product.desc} rules={[
                        { required: true, message: '必须输入商品描述' },
                    ]} label="商品描述">
                        <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Item>
                    <Item name='price' initialValue={product.price} rules={[
                        { required: true, message: '必须输入商品价格' },
                        { validator: this.validatePrice }
                    ]} label="商品价格">
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item name='categoryIds' initialValue={categorys} rules={[{ required: true, message: '必须指定商品的分类' },]} label='商品分类'>
                        <Cascader
                            placeholder='请指定商品的分类'
                            options={this.state.options}  //需要显示的列表数据数组
                            loadData={this.loadData}   //当选择某个列表项 加载下一级列表的回调
                        />
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情' wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button onClick={this.submit} type='primary'>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }

}
