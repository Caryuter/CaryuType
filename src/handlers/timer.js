class Timer {
	_instance;
	_count = 0;
	_id;
	_callback = () => {};

	constructor() {
		if (this._instance) {
			throw new Error("Only one instance of timer can be created");
		}
		this._instance = this;
	}

	get count() {
		return this._count;
	}
	/**
	 * Sets callback for every counter increment in timer
	 * @param {Function} val
	 */
	setCallback(val) {
		this._callback = val;
	}

	start() {
		if (this._id) return;
		this._id = setInterval(() => {
			this._count++;
			this._callback();
		}, 1000);
	}

	reset() {
		if (this._id) {
			this._count = 0;
			clearInterval(this._id);
			this._id = null;
		}
	}

	pause() {
		if (this._id) {
			clearInterval(this._id);
			this._id = null;
		}
	}
}

let instance = new Timer();

export default instance;
