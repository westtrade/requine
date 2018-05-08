import requine from '../../lib'

const logger = console.log

export default requine(module, {
  resolve(){
    this.exports = this.exports.default({ logger, name: this.basename })
  }
})
