import { isEmpty } from './utils'

class Validate {
  constructor(formName) {
    this.formName = formName
    this.validation = {}
  }
  collectValidation(rulesMap) {
    this.validation[this.formName] = {
      ...this.validation[this.formName],
      ...rulesMap,
    }
  }
  validateField(field, value) {
    return new Promise(resolve => {
      // 校验通过就resolve(null)
      const rules = this.validation[this.formName][field]
      let message = null
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].required) {
          if (isEmpty(value)) {
            message = rules[i].message
            break
          }
        }
        if (rules[i].validator) {
          try {
            rules[i].validator(rules, value, mess => {
              if (mess) {
                throw new Error(mess)
              }
            })
          } catch (e) {
            message = e.message
            break
          }
        }
      }
      resolve({
        field,
        message,
      })
    })
  }
  // 校验所有的属性
  validateAllFields(values) {
    return Promise.all(Object.keys(this.validation[this.formName]).map(field => this.validateField(field, values[field])))
  }
  // 检查必填字段
  checkRequire(value) {

  }
}

export const validate = new Validate('formName')
