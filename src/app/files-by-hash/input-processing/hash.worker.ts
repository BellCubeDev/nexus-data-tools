// this is a worker which gets a File object and returns its MD5 hash

import { createMD5 } from "hash-wasm";

//const md5Hasher = await createMD5();
//md5Hasher.init();
//
//const reader = file.stream().getReader();
//let done = false;
//
//while (!done) {
//    const { value, done: done_ } = await reader.read();
//    done = done_;
//    if (value) md5Hasher.update(value);
//}
//
//reader.releaseLock();
//return md5Hasher.digest();

const file = await new Promise<File>((resolve) => {
    self.onmessage = (event) => {
        resolve(event.data);
    };
});

const md5Hasher = await createMD5();
md5Hasher.init();

const reader = file.stream().getReader();
let done = false;

while (!done) {
    const { value, done: done_ } = await reader.read();
    done = done_;
    if (value) md5Hasher.update(value);
}

reader.releaseLock();

self.postMessage(md5Hasher.digest());
