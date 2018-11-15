module.exports = ({
  languages,
}) => {
  const entry = {}
  for (let i = 0; i < languages.length; i += 1) {
    const d = languages[i]
    entry[d.name] = d.entry
  }
  return entry
}
