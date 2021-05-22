import React, { Component } from 'react'
import propTypes from 'prop-types'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {

    static propTypes = {
        detail: propTypes.string
    }

    state = {
        //创建一个没有内容的编辑对象 
        editorState: EditorState.createEmpty()
    }

    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) {
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }

    onEditorStateChange = (editorState) => {
        //实时回调
        this.setState({
            editorState
        })
    }

    getDetail = () => {
        //返回输入
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange} //绑定监听
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallback, alt: { present: true, mandatory: true } }
                }}
            />
        )
    }
}
