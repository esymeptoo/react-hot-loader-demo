import React from 'react'
import Input from '@/components/Input/Input'
import Form from '@/containers/Form/Index'

class TestForm extends React.Component {
  static defaultProps = {
    formData: {},
  }
  render() {
    const { getFormDecorator } = this.props.form
    return <Form>
      {
        getFormDecorator({
          field: 'name',
        })(<Input />)
      }
    </Form>
  }
}

export default Form.create({
  onChange(props, changedField) {
    props.onChange(changedField)
  },
  mapPropsToFields(props) {
    return {

    }
  },
})(TestForm)
