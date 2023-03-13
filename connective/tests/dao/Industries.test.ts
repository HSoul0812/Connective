import {DAO} from "../../lib/dao";
import mysql, { RowDataPacket } from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { Industry } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

/**
 * test for getAll function of Industries class
*/
describe("Gets all Industries", () => {
  test("get industries",async () => {
    let industries: Array<Industry> = await DAO.Industries.getAll();

    expect(industries.length).toBeGreaterThan(0);
  })
})
