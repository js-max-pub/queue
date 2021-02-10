import Slot, { sleep } from './slot.js';

let slot = new Slot(3,true);

async function a() {
	await slot.reserve('a.sleep');
	await sleep();
	slot.release();
	await slot.reserve();
	await sleep();
	slot.release();	
	await slot.reserve();
	await sleep();
	slot.release();
}


async function f() {
	await slot.execute(sleep,3000);
	await slot.execute(sleep);
	await slot.execute(sleep,500);
}


a()
a()
a()
a()
f()
f()
slot.clear()