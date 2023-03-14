import {DAO} from "../../lib/dao";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";

describe("Get All", () => {
  test("Get all users",async () => {
      let Users = await DAO.Discover.getAll();

      expect(Users.length).toBeGreaterThan(0);
  })
})
