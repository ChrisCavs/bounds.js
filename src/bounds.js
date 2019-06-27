const noOp = () => {}

const getMargins = (margins) => {
  if (!margins) return '0px 0px 0px 0px'

  const {top, right, bottom, left} = margins
  return `${top}px ${right}px ${bottom}px ${left}px`
}

const checkForObserver = () => {
  if (!IntersectionObserver) {
    throw new Error(`
      bounds.js requires IntersectionObserver on the global object.
      IntersectionObserver is unavailable in IE and other older
      versions of browsers.
      See https://github.com/ChrisCavs/bounds.js/blob/master/README.md
      for more compatibility information.
    `)
  }
}

class Bound {
  constructor({root, margins, thresholds, onEmit}}) {
    checkForObserver()

    const marginString = getMargins(margins)
    const options = {
      root: options.root || null,
      rootMargin: marginString,
      thresholds: thresholds || [0.0],
    }

    this.observer = new IntersectionObserver(
      this._emit.bind(this),
      options
    )
    this.nodes = []
    this.onEmit = onEmit || noOp
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
    const index = _findByNode(el, true)

    if (index !== -1) {
      this.nodes.splice(index, 1)
      this.observer.unobserve(el)
    }

    return this
  }

  check(el) {
    const data = _findByNode(el)
    return data.history
  }

  clear() {
    this.nodes = []
    this.observer.disconnect()

    return this
  }

  // HELPERS
  _emit(events) {
    events.forEach(event => {
      const data = this._findByNode(event.target)
      const ratio = event.intersectionRatio

      data.history = event.isIntersecting

      event.isIntersecting
        ? data.onEnter(ratio)
        : data.onLeave(ratio)
    })

    this.onEmit()
  }

  _findByNode(el, returnIndex=false) {
    const func = returnIndex ? 'findIndex' : 'find'

    return this.nodes[func](node => {
      return node.isEqualNode(el)
    })
  }
}

export default Bound
