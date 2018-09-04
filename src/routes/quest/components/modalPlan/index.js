import React from 'react'
import {
  Modal,
  Form,
  Slider,
  Checkbox,
  Button,
} from 'antd'
import qDB from '@/db/questDB'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

class ModalPlan extends React.Component {
  render () {
    // 获取属性
    const {
      form,
      dispatch,
      quest,
    } = this.props
    const {
      modalPlanVisible,
    } = quest
    const { getFieldDecorator } = form

    // 方法定义
    const submit = () => {
      const { validateFields } = form
      validateFields((err, value) => {
        if (!err) {
          console.log(value)
          dispatch({
            type: 'quest/countQuest',
            payload: value,
          })
        }
      })
    }

    // 属性定义
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const propsOfModal = {
      title: '筹划弹窗',
      visible: modalPlanVisible,
      width: '70%',
      footer: null,
      onCancel: () => {
        dispatch({ type: 'quest/showModalPlan', show: false })
      },
    }

    return (
      <Modal {...propsOfModal}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="后勤时数"
          >
            {getFieldDecorator('hour', {
              initialValue: 0,
            })(
              <Slider
                min={0}
                max={24}
                marks={{ 4: 4, 8: 8, 12: 12, 24: 24 }}
              />
              // <InputNumber min={0} max={24} placeholder="0-24" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="后勤分钟数"
          >
            {getFieldDecorator('min', {
              initialValue: 0,
            })(
              <Slider
                min={0}
                max={59}
                marks={{ 10: 10, 30: 30, 50: 50 }}
              />
              // <InputNumber min={0} max={59} placeholder="0-59" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="资源"
          >
            {getFieldDecorator('resource', {
              initialValue: [],
            })(
              <CheckboxGroup
                options={qDB.resource.map(d => {
                  return { label: d.label, value: d.name }
                })}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="额外道具"
          >
            {getFieldDecorator('extra', {
              initialValue: [],
            })(
              <CheckboxGroup
                options={qDB.extra.map(d => {
                  return { label: d.name, value: d._id }
                })}
              />
            )}
          </FormItem>
        </Form>
        <Button type='primary' onClick={submit}>试算</Button>
      </Modal>
    )
  }
}

export default Form.create()(ModalPlan)
