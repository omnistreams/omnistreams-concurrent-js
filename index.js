class Stream {
  onError(callback) {
    this._errorCallback = callback
  }
}

class ProducerStream extends Stream {
  constructor() {
    super()
    //this._dataCallback = () => {}
    //this._endCallback = () => {}
    this._demand = 0
  }

  request(numBytes) {
    this._demand += numBytes
    this._demandChanged()
  }

  pipe(consumerStream) {
    this._dataCallback = (data) => {
      consumerStream.write(data)
    }

    this.onEnd(() => {
      consumerStream.end()
    })

    consumerStream.onRequest((numBytes) => {
      this.request(numBytes)
    })
  }

  onData(callback) {
    this._dataCallback = callback
  }

  onEnd(callback) {
    this._endCallback = callback
  }

  _demandChanged() {
    throw "_demandChanged must be implemented"
  }
}


class ConsumerStream extends Stream {
  constructor(options) {
    super()

    const opts = options ? options : {}

    this._bufferSize = opts.bufferSize ? opts.bufferSize : 1024*1024
    this._demand = this._bufferSize

    this._endCallback = () => {}
  }

  write(data) {
    if (data.byteLength > this._demand) {
      this._errorCallback("Attempt to write more than requested amount of data")
    }

    this._demand += data.byteLength
    this._write(data)
  }

  end() {
    this._endCallback()
  }

  onRequest(callback) {
    this._onRequestCallback = callback
    callback(this._bufferSize)
  }

  onEnd(callback) {
    this._endCallback = callback
  }

  _write() {
    throw "_write must be implemented"
  }
}

module.exports = {
  ProducerStream,
  ConsumerStream,
}
