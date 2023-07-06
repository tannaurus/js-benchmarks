const benchmark = require("benchmark");

const suite = new benchmark.Suite("text encoder", {
  onCycle: function (event: any) {
    console.log(String(event.target));
  },
  onComplete: function () {
    console.log("Fastest is: 👉 " + this.filter("fastest").map("name"));
  },
});

// stores instance of TextDecoder
class Decoder {
  decoder: any;

  constructor() {
    this.decoder = new TextDecoder();
  }

  decode(message: Uint8Array): string {
    return this.decoder.decode(message);
  }
}

// creates a new instance of TextDecoder every time
const newDecoder = (message: Uint8Array): string => {
  return new TextDecoder().decode(message);
};

let encodedMessage = new TextEncoder().encode("Hello, world!");

let reusedDecoder = new Decoder();
suite.add("Using TextDecoder instance cached in class", function () {
  reusedDecoder.decode(encodedMessage);
});

suite.add("Instantiating new TextDecoder every function call", function () {
  newDecoder(encodedMessage);
});

suite.run();

/**
 * Results 👇
 * Using TextDecoder instance cached in class x 1,297,920 ops/sec ±2.57% (76 runs sampled)
 * Instantiating new TextDecoder every function call x 1,007,902 ops/sec ±1.79% (93 runs sampled)
 * Fastest is: 👉 Using TextDecoder instance cached in class
 */
