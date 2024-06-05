// this is a worker which gets a File object and returns its MD5 hash

import { createMD5 } from "hash-wasm";

const file = await new Promise<File>((resolve) => {
    self.onmessage = (event) => {
        resolve(event.data);
    };
});

const md5Hasher = await createMD5();
md5Hasher.init();

const reader = file.stream().getReader();
let done = false;

let readPromise = reader.read();
while (!done) {
    const { value, done: done_ } = await readPromise;
    done = done_;
    if (!done) readPromise = reader.read();
    if (value) md5Hasher.update(value);
}

reader.releaseLock();

self.postMessage(md5Hasher.digest());
