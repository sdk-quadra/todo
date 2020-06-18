const contextMenu = window.VueContextMenu
const app = new Vue({
  el: '#app',
  data: {
    showDone: false,
    showLink: false,
    tasks: [],
    done: [],
    newTask: null,
    deleteNum: null,
    taskNum: null,
    doneNum: null,
    maxList: 100
  },
  components: {
    contextMenu
  },
  mounted () {
    if (window.localStorage.getItem('tasks')) {
      try {
        this.tasks = JSON.parse(window.localStorage.getItem('tasks'))
      } catch (e) {
        window.localStorage.removeItem('tasks')
      }
    }
    if (window.localStorage.getItem('done')) {
      try {
        this.done = JSON.parse(window.localStorage.getItem('done'))
        this.existDone()
      } catch (e) {
        window.localStorage.removeItem('done')
      }
    }
  },
  methods: {
    addTask () {
      if (!this.newTask || window.event.keyCode !== 13 || !this.limitListSize()) {
        return
      }
      this.tasks.push(this.newTask)
      this.newTask = ''
      this.saveTasks()
    },
    editTask (n, value) {
      if (!value || window.event.keyCode !== 13) return
      this.tasks.splice(n, 1, value)
      this.saveTasks()
      this.taskNum = null
    },
    editDone (n, value) {
      if (!value || window.event.keyCode !== 13) return
      this.done.splice(n, 1, value)
      this.saveDone()
      this.doneNum = null
    },
    editBlurTask (n, value) {
      if (!value) return
      this.tasks.splice(n, 1, value)
      this.saveTasks()
      this.taskNum = null
    },
    editBlurDone (n, value) {
      if (!value) return
      this.done.splice(n, 1, value)
      this.saveDone()
      this.doneNum = null
    },
    backTask (item) {
      this.tasks.push(item)
      this.saveTasks()
    },
    backDone (item) {
      this.done.push(item)
      this.saveDone()
    },
    deleteTask (n) {
      this.tasks.splice(n, 1)
      this.saveTasks()
    },
    deleteDone (n) {
      this.done.splice(n, 1)
      this.saveDone()
    },
    removeTask (n) {
      const item = this.tasks.splice(n, 1)
      this.saveTasks()
      this.backDone(item[0])
      this.uncheckTaskBox()
    },
    removeDone (n) {
      const item = this.done.splice(n, 1)
      this.saveDone()
      this.backTask(item[0])
      this.checkDoneBox()
    },
    checkDoneBox () {
      for (d in this.done) {
        document.getElementsByClassName('check-done')[d].checked = true
      }
    },
    uncheckTaskBox () {
      for (t in this.tasks) {
        document.getElementsByClassName('uncheck-task')[t].checked = false
      }
    },
    saveTasks () {
      const parsed = JSON.stringify(this.tasks)
      window.localStorage.setItem('tasks', parsed)
      this.existDone()
    },
    saveDone () {
      const parsed = JSON.stringify(this.done)
      window.localStorage.setItem('done', parsed)
      this.existDone()
    },
    limitListSize () {
      if (this.tasks.length + this.done.length > this.maxList) {
        window.alert('exceed! list is full. \nplease delete unnecessary list (right click to delete).')
        return false
      } else {
        return true
      }
    },
    existDone () {
      this.done.length > 0 ? this.showLink = true : this.showLink = false
    },
    deleteAllEntry () {
      if (window.confirm('Are you sure? \nDelete all lists (including done list)')) {
        window.localStorage.clear()
        window.location.reload()
      }
    },
    storeDeleteNum (n) {
      this.deleteNum = n
    },
    showEditTaskInput (n) {
      this.taskNum = n
      this.focusItem(n)
    },
    showEditDoneInput (n) {
      this.doneNum = n
      this.focusItem(n)
    },
    focusItem (n) {
      this.$nextTick(() => {
        this.$refs[n][0].focus()
      })
    }
  }
})
