export default ({ logger, name }) => ({
  name,
  schema: {
    firstName: String,
    lastName: String,
  },
  log(){ logger(name) }
})
