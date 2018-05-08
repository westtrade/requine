export default ({ logger, name }) => ({
  name,
  schema: {
    type: String,
    value: String,
  },
  log(){ logger(name) }
})
