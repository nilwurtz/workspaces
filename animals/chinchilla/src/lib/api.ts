const endpoint = "http://nginx:80"

export const getCardHtml = async () => {
  const response = await fetch(`${endpoint}/Card.js`)
  const card = await response.text()
  return card
}