// intersection types
type A = {
  text: string;
};

type B = {
  count: number;
  action: () => void;
};

// AandB === Marged
type Marged = A & B;

type AandB = {
  text: string;
  count: number;
  action: () => void;
};

// union types
type StrOrNum = string | number;

type UncertaintyFunc = () => string | boolean | undefined;

// optionalProperty === optionalText
type optionalProperty = {
  text?: string;
};

type optionalText = {
  text: string | undefined;
};

// string literal
type Foo = "foo";
type OneToFive = 1 | 2 | 3 | 4 | 5;
type UzabaseStr = "Uzabase" | "uzabase" | "UZABASE" | "ユーザベース";

const printUb = (ub: UzabaseStr) => {
  console.log(ub);
};

// printUb("");

// Utility Types
// https://www.typescriptlang.org/docs/handbook/utility-types.html
