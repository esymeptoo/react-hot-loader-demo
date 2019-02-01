import React from 'react'
import createFieldsStore from './createFiledStore'
import { validate } from './validate'
import './style.less'

const fieldsStore = createFieldsStore()

// 挟持表单props的高阶函数
// option: { field: String, {} }
// change事件之前做校验 需要校验的field、规则和校验的值
export function getFormDecorator({ onChange, setValidateErrorMessage }, props, option) {
  const { field, propsToField, rules } = option
  if (rules) {
    validate.collectValidation({
      [`${field}`]: rules,
    })
  }
  return function createFormDecorator(WrapperComponent) {
    const changeEvent = e => {
      const value = e.target.value
      validate.validateField(field, value)
        .then(validateResult => {
          // 校验未通过
          setValidateErrorMessage(validateResult)
          // 触发change事件
          onChange
            ? onChange(props, {
              [`${field}`]: value,
            })
            : props.onChange(props, {
              [`${field}`]: value,
            })
        })
    }
    return <div className="form-decorator-wrapper">
      {
        React.cloneElement(
          WrapperComponent,
          // change等事件之前先执行校验
          {
            [propsToField ? propsToField : 'value']: props[field],
            onChange: changeEvent,
          },
        )
      }
      {
        props.validation[field] && <div className="error-decorator-wrapper">{props.validation[field]}</div>
      }
    </div>
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
          formData: {
            ...nextProps,
          },
          validation: {},
        }
      }
      // onChange存在与否都会调这个change事件
      handleValueChange(p, cf) {
        this.setState({
          formData: {
            ...this.state.formData,
            ...cf,
          },
        })
        if (onChange) return onChange(p, cf)
        // 如果走到这里代表条用户没有注册Form.create的onChange事件  这样会有一个问题 外层组件没法获取到用户自定义的change事件 只能强制用户需要写一个固定名字的change事件
        this.props.onValueChange(cf)
      }
      setValidateErrorMessage({ field, message }) {
        this.setState({
          validation: {
            ...this.state.validation,
            [`${field}`]: message,
          },
        })
      }
      // 是否通过校验
      get isValidatePass() {
        return Object.keys(this.state.validation).some(field => this.state.validation[field] !== null)
      }
      render() {
        const events = {}
        if (onChange) {
          events.onChange = this.handleValueChange.bind(this)
        }
        // 这里之所以要合并this.state和this.props是因为用户可以选择通过一个属性将form用到的属性传进来通过mapPropsToFields解析 也可以直接通过form用到的属性传props进来
        const formProps = {
          getFormDecorator: getFormDecorator.bind(this, {
            ...events,
            setValidateErrorMessage: this.setValidateErrorMessage.bind(this),
          }, {
            ...this.state.formData,
            ...this.props,
            ...events,
            validation: this.state.validation,
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
    const { children, label } = this.props
    return <div className="form-item-wrapper">
      <span>{label + ':'}</span>
      {children}
    </div>
  }
}

Form.Item = FormItem

export default Form
