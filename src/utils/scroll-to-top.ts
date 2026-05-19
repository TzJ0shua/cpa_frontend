export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  const scrollingElement = document.scrollingElement ?? document.documentElement

  scrollingElement.scrollTo({
    top: 0,
    left: 0,
    behavior,
  })
}
