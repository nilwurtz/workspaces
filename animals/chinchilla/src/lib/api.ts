const endpoint = "http://baboon:3001"

export const getCardHtml = async () => {
  const response = await fetch(`${endpoint}/card`)
  const card = await response.text()
  return card
}