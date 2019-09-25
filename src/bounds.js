const checkForObserver = () => {
  if (!('IntersectionObserver' in window)) {
    throw new Error(`
      bounds.js requires IntersectionObserver on the global object.
      IntersectionObserver is unavailable in IE and other older
      versions of browsers.
      See https://github.com/ChrisCavs/bounds.js/blob/master/README.md
      for more compatibility information.
    `)
  }
}

const getMargins = (margins = {}) => {
  const {
    top = 0,
    right = 0,
    bottom = 0,
    left = 0
  } = margins
  return `${top}px ${right}px ${bottom}px ${left}px`
}

const noOp = () => {}

const bound = (options) => {
  return new Boundary(options)
}

class Boundary {
  constructor({root, margins, threshold, onEmit} = {}) {
    checkForObserver()

    const marginString = getMargins(margins)
    const options = {
      root: root || null,
      rootMargin: marginString,
      threshold: threshold || 0.0,
    }

    this.nodes = []
    this.onEmit = onEmit || noOp
    this.observer = new IntersectionObserver(
      this._emit.bind(this),
      options
    )
  }

  // API
  watch(el, onEnter=noOp, onLeave=noOp) {
    const data = {
      el,
      onEnter,
      onLeave,
    }

    this.nodes.push(data)
    this.observer.observe(el)

    return data
  }

  unWatch(el) {
    const index = this._findByNode(el, true)

    if (index !== -1) {
      this.nodes.splice(index, 1)
      this.observer.unobserve(el)
    }

    return this
  }

  check(el) {
    const data = this._findByNode(el) || {}
    return data.history
  }

  clear() {
    this.nodes = []
    this.observer.disconnect()

    return this
  }

  static checkCompatibility() {
    checkForObserver()
  }

  // HELPERS
  _emit(events) {
    const actions = events.map(event => {
      const data = this._findByNode(event.target)
      const ratio = event.intersectionRatio

      data.history = event.isIntersecting

      event.isIntersecting
        ? data.onEnter(ratio)
        : data.onLeave(ratio)

      return {
        el: event.target,
        inside: event.isIntersecting,
        outside: !event.isIntersecting,
        ratio: event.intersectionRatio
      }
    })

    this.onEmit(actions)
  }

  _findByNode(el, returnIndex=false) {
    const func = returnIndex ? 'findIndex' : 'find'

    return this.nodes[func](node => {
      return node.el.isEqualNode(el)
    })
  }
}

export default bound
