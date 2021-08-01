import { FirstName, FirstNameNeo, Name } from "../index"

describe("Name", () => {
  describe("#of", () => {
    it("returns Name instance." ,() => {
      const actual = Name.of("aaaa bbb")
      expect(actual.firstName).toEqual(new FirstName("aaaa"))
      expect(actual.lastName).toEqual(new FirstName("bbb"))
    })
    it("returns Name instance." ,() => {
      const actual = Name.of("aaaa bbb")
      expect(actual.firstName).toEqual(new FirstName("aaaa"))
      expect(actual.lastName).toEqual(new FirstNameNeo("bbb"))
    })
  })
})
