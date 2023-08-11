import * as z from "zod";

const foo = z.object({
  type: z.literal("foo"),
  foo: z.string(),
});

const bar = z.object({
  type: z.literal("bar"),
  bar: z.number(),
});

const parsed = z.union([foo, bar]).parse({ type: "foo", foo: "foo" });

if (parsed.type === "foo") {
  console.log(parsed.foo); // foo
} else {
  console.log(parsed.bar); // bar
}

if ("foo" in parsed) {
  console.log(parsed.foo); // foo
} else {
  console.log(parsed.bar); // bar
}
