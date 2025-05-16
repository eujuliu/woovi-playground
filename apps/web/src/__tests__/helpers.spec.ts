import {
  chunkArray,
  chunkNumber,
  convertNumberToMoney,
  sortByKey,
} from "@/helpers/";

describe("HELPERS", () => {
  it("should convert number to money", () => {
    const num = 10000;
    const money = convertNumberToMoney(num.toString());

    expect(money).toBe("$100.00");
  });

  it("should sort by key", () => {
    const items = [{ name: "Test 1" }, { name: "Test 2" }, { name: "Test 3" }];
    const result = [{ name: "Test 3" }, { name: "Test 2" }, { name: "Test 1" }];
    const sorted = sortByKey(items, "name", "dec");

    expect(sorted).toEqual(result);
  });

  it("should create a chunk array (array with sub-arrays)", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const chunks = chunkArray(items, 5);

    expect(chunks.every((chunk) => Array.isArray(chunk))).toBeTruthy();
    expect(chunks.length).toEqual(2);
  });

  it("should create a chunk array with the length", () => {
    const length = 35;
    const chunks = chunkNumber(length);

    expect(chunks.length).toEqual(4);
    expect(chunks.reduce((count, num) => count + num, 0)).toEqual(length);
  });
});
