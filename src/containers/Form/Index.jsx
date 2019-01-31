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
            [propsToField ? propsToField : 'value']: props[field],
            onChange: onChange
              ? e => onChange(props, {
                [`${field}`]: e.target.value,
              })
              : e => props.onChange(props, {
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
  // 这个onChange存在的意义是有两个  一个是帮助用户自定一个change事件名字 二是让用户自定义change参数
  const { onChange, mapPropsToFields } = formCreateOptions
  return function createForm(WrapperComponent) {
    return class CreateForm extends React.Component {
      constructor(props) {
        super(props)
        // 去除掉function类型的数据
        let nextProps = props
        // 如果存在mapPropsToFields 使用自定义的props属性当做state
        if (mapPropsToFields) {
          nextProps = mapPropsToFields(props)
        }
        this.state = {
          ...nextProps,
        }
      }
      // onChange存在与否都会调这个change事件
      handleValueChange(p, cf) {
        this.setState(cf)
        if (onChange) return onChange(p, cf)
        // 如果走到这里代表条用户没有注册Form.create的onChange事件  这样会有一个问题 外层组件没法获取到用户自定义的change事件 只能强制用户需要写一个固定名字的change事件
        this.props.onValueChange(cf)
      }
      render() {
        const obj = {}
        if (onChange) {
          obj.onChange = this.handleValueChange.bind(this)
        }
        // 这里之所以要合并this.state和this.props是因为用户可以选择通过一个属性将form用到的属性传进来通过mapPropsToFields解析 也可以直接通过form用到的属性传props进来
        const formProps = {
          getFormDecorator: getFormDecorator.bind(this, {
            ...obj,
          }, {
            ...this.state,
            ...this.props,
            ...obj,
          }),
        }
        return <WrapperComponent
          {...this.props}
          {...this.state}
          form={formProps}
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
