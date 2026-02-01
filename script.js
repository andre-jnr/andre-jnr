const text = 'André Júnior'
const typingElement = document.getElementById('typing')

let index = 0
let isDeleting = false

function typeLoop() {
  if (!isDeleting) {
    // Digitando
    typingElement.textContent = text.substring(0, index + 1)
    index++

    if (index === text.length) {
      setTimeout(() => (isDeleting = true), 3000)
    }
  } else {
    // Apagando
    typingElement.textContent = text.substring(0, index - 1)
    index--

    if (index === 0) {
      isDeleting = false
    }
  }

  const speed = isDeleting ? 90 : 120
  setTimeout(typeLoop, speed)
}

typeLoop()
