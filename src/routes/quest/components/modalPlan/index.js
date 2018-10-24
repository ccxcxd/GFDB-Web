import React from 'react'
import {
  Modal,
  Form,
  Slider,
  Checkbox,
  Button,
} from 'antd'
import mDB from '@/db/mainDB'

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
    const resourceList = mDB.item_info.filter((ele) => [
      '501',
      '502',
      '503',
      '504',
    ].indexOf(ele.id) !== -1)
    const extraList = mDB.item_info.filter((ele) => [
      '1',
      '2',
      '3',
      '4',
      '41',
    ].indexOf(ele.id) !== -1)

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
      title: __('logistic.supportPlan.countModalName'),
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
            label={__('logistic.supportPlan.hourLabel')}
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
            label={__('logistic.supportPlan.minuteLabel')}
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
            label={__('logistic.supportPlan.resourceLabel')}
          >
            {getFieldDecorator('resource', {
              initialValue: [],
            })(
              <CheckboxGroup
                options={resourceList.map(d => {
                  return { label: __(d.item_name), value: d.code }
                })}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={__('logistic.supportPlan.extraLabel')}
          >
            {getFieldDecorator('extra', {
              initialValue: [],
            })(
              <CheckboxGroup
                options={extraList.map(d => {
                  return { label: __(d.item_name), value: d.id }
                })}
              />
            )}
          </FormItem>
        </Form>
        <Button type='primary' onClick={submit}>{__('logistic.supportPlan.countButton')}</Button>
      </Modal>
    )
  }
}

export default Form.create()(ModalPlan)
