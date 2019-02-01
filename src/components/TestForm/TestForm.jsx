import React from 'react'
import Input from '@/components/Input/Input'
import Form from '@/containers/Form/Index'

const FormItem = Form.Item

const validateName = (rules, value, cb) => {
  if (value === 'zc111') {
    return cb('该名字已经被注册')
  }
  return cb()
}

class TestForm extends React.Component {
  static defaultProps = {
    formData: {},
  }
  render() {
    const { getFormDecorator } = this.props.form
    return <Form>
      <FormItem label="姓名">
        {
          getFormDecorator({
            field: 'name',
            rules: [
              { required: true, message: '姓名不能为空', trigger: 'change' },
              { validator: validateName },
            ],
          })(<Input />)
        }
      </FormItem>
    </Form>
  }
}

export default Form.create({
  onChange(props, changedField) {
    props.onValueChange(changedField)
  },
  mapPropsToFields(props) {
    return {
      name: props.formData.name,
    }
  },
})(TestForm)
