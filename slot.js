export default class Queue {
	constructor(size = 5, log = false) {
		this.size = size;
		this.available = size;
		this.queue = [];
		this._log = log;
		this.count = 0;
	}
	log(...p) {
		if (this._log) console.log(...p)
	}
	get statString() {
		return `[${this.size - this.available}|${this.queue.length}]`;
	}
	reserve(name = '') {
		this.count++;
		if (this.available > 0) {
			this.available--;
			this.log(`${this.statString} task #${this.count}: run    ${name}`)
			return Promise.resolve();
		} else {
			this.log(`${this.statString} task #${this.count}: wait   ${name}`)
			// this.log(`no slots left, queue it`)
			return new Promise(resolve => this.queue.push([resolve, this.count, name]))
		}
	}
	release() {
		if (this.queue.length > 0) {
			let [task, count, name] = this.queue.shift();
			this.log(`${this.statString} task #${count}: run    ${name}`)
			task();
		}
		else {
			this.available++;
			this.log(`${this.statString} release slot`)
		}
	}
	/**
	 * shortcut for reserve + do-stuff + release
	 * @param {} f 
	 * @param  {...any} p 
	 * @returns 
	 */
	async execute(f, ...p) {
		// this.log('execute', f, p);
		await this.reserve(f.name + ' (' + p.join(', ') + ')');
		let result = await f(...p);
		this.release();
		return result;
	}

	clear() {
		this.log('clear queue', this.queue.length);
		this.queue = [];
		// while (this.queue.shift()) {
		// 	this.log(`${this.statString} release slot`)
			// this.available++;
		// }
	}
}

export function sleep(duration = Math.round(Math.random() * 1000)) {
	return new Promise(resolve => setTimeout(resolve, duration))
}