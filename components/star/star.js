Component({
  properties: {
    score: {
      type: [Array, String],
      value: 0,
      observer (newVal, oldVal, path) {}
    },
    readOnly: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, path) {}      
    },
    size: {
      type: String,
      value: 'default',
      observer(newVal, oldVal, path) {
        let classes = this.data.classes.concat(newVal)
        this.setData({
          classes
        })
      } 
    }
  },
  data: {
    classes: ['star']
  },
  methods: {
    tapHandler (e) {
      if (this.properties.readOnly) return
      let index = e.currentTarget.dataset.index
      this.setData({
        score: index + 1
      })
      let myEventDetail = {
        score: this.data.score
      }
      this.triggerEvent('scorechange', myEventDetail)
    }
  },
  attached () {
    if (!this.properties.readOnly) {
      this.setData({
        score: 0
      })
      let myEventDetail = {
        score: this.data.score
      }
      this.triggerEvent('scorechange', myEventDetail)
    }
  }
})
