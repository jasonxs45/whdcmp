const classMap = {
  "line": "line"
}
Component({
  properties: {
    splitType: {
      type: String,
      value: '',
      observer (newVal, oldVal, changedPath) {
        if (classMap[newVal]) {
          let classes
          if (this.data.classes.length < 2) {
            classes = [...this.data.classes, classMap[newVal]]
          } else {
            this.data.classes.splice(1, 1, classMap[newVal])
            classes = this.data.classes
          }
          this.setData({
            classes
          })
        }
      }
    }
  },
  data: {
    classes: [
      'split'
    ]
  }
})
