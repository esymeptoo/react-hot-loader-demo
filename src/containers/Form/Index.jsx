import React from 'react'
import createFieldsStore from './createFiledStore'
import './style.less'

const fieldsStore = createFieldsStore()

// 挟持表单props的高阶函数
// option: { field: String, {} }
export function getFormDecorator({ onChange }, props, option) {
  const { field, propsToField } = option
  return function createFormDecorator(WrapperComponent) {
    return <span>
      {
        React.cloneElement(
          WrapperComponent,
          {
            [propsToField ? propsToField : 'value']: props.formData[field],
            onChange: onChange
              ? e => onChange(props, {
                [`${field}`]: e.target.value,
              })
              : e => props.onChange({
                [`${field}`]: e.target.value,
              })
          },
        )
      }
    </span>
  }
}

class Form extends React.Component {
  render() {
    const { children } = this.props
    return <form>
      {
        children
      }
    </form>
  }
}

Form.create = function(formCreateOptions = {}) {
  const { onChange } = formCreateOptions
  return function createForm(WrapperComponent) {
    const formProps = ctx => ({
      getFormDecorator: getFormDecorator.bind(ctx, {
        onChange,
      }, ctx.props),
    })
    return class CreateForm extends React.Component {
      render() {
        return <WrapperComponent
          {...this.props}
          form={formProps(this)}
          onChange={onChange.bind(this)}
        />
      }
    }
  }
}

// TODO: 待实现  将props的表单属性直接映射到props上
Form.createFormField = function () {}

class FormItem extends React.Component {
  render() {
    const { children } = this.props
    return <div>
      {children}
    </div>
  }
}

Form.Item = FormItem

export default Form
