import React from 'react'
import { connect } from 'dva'
import {
  Select,
  Icon,
  Button,
  message,
} from 'antd'

import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript.js'

// import CodeMirror from 'codemirror/lib/codemirror.js'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/theme/eclipse.css'

import les from './index.less'

const Option = Select.Option

const cmOption = {
  mode: { name: 'javascript', json: true },

  theme: 'material',
  lineNumbers: true,
  autocorrect: true,
  tabSize: 2,
}

const typeSource = [
  { value: 'normal', label: '通用' },
  { value: 'normal_filter', label: '通用去隐私' },
  { value: 'tsv', label: 'tsv' },
  { value: 'excel_beiju', label: '杯具Excel' },
  { value: 'web_yuezhang', label: '乐章Web' },
]
const typeOutput = [
  { value: 'normal', label: '通用' },
  { value: 'normal_filter', label: '通用去隐私' },
  { value: 'tsv', label: 'tsv' },
  { value: 'excel_beiju', label: '杯具Excel' },
  { value: 'web_yuezhang', label: '乐章Web' },
]

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      input: '',  // 输入
      outputBlue: '', // 蓝色芯片输出
      outputOrange: '', // 橙色芯片输出
    }
  }

  handleTransform () {
    // 检测输入数据是否标准json
    const input = this.state.input
    let inputObject = {}
    let outputBlue = {}
    let outputOrange = {}
    try {
      inputObject = JSON.parse(input)
    } catch (e) {
      message.warning('json 格式错误')
      inputObject = null
    }
    if (inputObject) {
      console.log(inputObject)
      // 转换过程
      outputBlue = { content: '示例蓝色芯片结果' }
      outputOrange = { content: '示例橙色芯片结果' }
    } else {
      // 重置输出
      outputBlue = {}
      outputOrange = {}
    }
    this.setState({
      outputBlue: JSON.stringify(outputBlue) || '',
      outputOrange: JSON.stringify(outputOrange) || '',
    })
  }

  render () {
    const {
      input,
      outputBlue,
      outputOrange,
    } = this.state

    return (
      <div className={les.container}>
        <div className={les.transformType}>
          <div className={les.selectWrap}>
            <title>输入格式</title>
            <Select
              defaultValue={typeSource[0]['value']}
              className={les.select}
            >
              {
                typeSource.map(ts => (
                  <Option key={ts.value} value={ts.value}>{ ts.label }</Option>
                ))
              }
            </Select>
          </div>
          <Icon type="double-right" className={les.iconMiddle} />
          <div className={les.selectWrap}>
            <title>输出格式</title>
            <Select
              defaultValue={typeOutput[0]['value']}
              className={les.select}
            >
              {
                typeOutput.map(ts => (
                  <Option key={ts.value} value={ts.value}>{ ts.label }</Option>
                ))
              }
            </Select>
          </div>
        </div>
        <div className={les.sourceInput}>
          <title>源json</title>
          <div className={les.editor}>
            <CodeMirror
              value={input}
              options={cmOption}
              onBeforeChange={(editor, data, value) => {
                this.setState({ input: value })
              }}
            />
          </div>
        </div>
        <div className={les.outputBtn}>
          <Button
            className={les.btn}
            type="primary"
            onClick={() => this.handleTransform()}
          >转换</Button>
        </div>
        <div className={les.outputArea}>
          <div className={les.outBlue}>
            <title>蓝色芯片输出</title>
            <CodeMirror
              value={outputBlue}
              options={{
                ...cmOption,
                readOnly: true,
              }}
            />
          </div>
          <div className={les.outOrange}>
            <title>橙色芯片输出</title>
            <CodeMirror
              value={outputOrange}
              options={{
                ...cmOption,
                readOnly: true,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ app }) => ({ app }))(Main)
