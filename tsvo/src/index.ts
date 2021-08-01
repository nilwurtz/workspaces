
export class Name {
  constructor(readonly firstName: FirstName, readonly lastName: LastName) {}
  static of(fullName: string): Name {
    const [first, last] = fullName.split(" ")
    return new Name(new FirstName(first), new LastName(last))
  }
}

export class FirstName {
  constructor(readonly value: string) {}
}

export class FirstNameNeo {
  constructor(readonly value: string) {}
  echo() {
    console.log(this.value)
  }
}

export class LastName {
  constructor(readonly value: string) {}
}