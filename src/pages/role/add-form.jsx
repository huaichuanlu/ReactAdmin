import React from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item

/*
添加分类的form组件
*/
const AddForm = (props) => {
    const [form] = Form.useForm();
    props.setForm(form)
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 15 }
    }

    return (
        <Form form={form}>
            <Item {...formItemLayout} label='角色名称' name='roleName' initialValue=''
                rules={[{ required: true, message: '角色名称必须输入' }]}>
                <Input placeholder='请输入角色名称' />
            </Item>
        </Form>
    )
}
export default AddForm