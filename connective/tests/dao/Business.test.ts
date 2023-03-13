import {DAO} from "../../lib/dao";
import mysql, { RowDataPacket } from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { Business } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

describe("Determines if a user is a business", () => {
  test("check with user which is business",async () => {
      let isBusiness = await DAO.Business.isBusiness(412);

      expect(isBusiness).toBe(true);
  })

  test("check with user which is not business",async () => {
      let isBusiness = await DAO.Business.isBusiness(437);

      expect(isBusiness).toBe(false);
  })
})

describe("Get a business by Id", () => {
  test("Get business by Id which exists",async () => {
    let Business = await DAO.Business.getByUserId(412);

    expect(typeof(Business)).not.toBe("boolean");

    if(typeof(Business) != "boolean") {
      expect(Business.id).not.toBeNull();
      expect(Business.user_id).not.toBeNull();
      expect(Business.company_name).not.toBeNull();
      expect(Business.description).not.toBeNull();
      expect(Business.logo).not.toBeNull();
      expect(Business.website).not.toBeNull();
      expect(Business.location).not.toBeNull();
      expect(Business.industry).not.toBeNull();
      expect(Business.size).not.toBeNull();
      expect(Business.profileViews).not.toBeNull();
      expect(Business.listViews).not.toBeNull();
    }
  })

  test("Get business by Id which not exist",async () => {
    let Business = await DAO.Business.getByUserId(437);

    expect(typeof(Business)).toBe("boolean");
    expect(Business).toBe(false);
  })
})

describe("Add new business", () => {
  test("Add new business",async () => {
    let Id = await DAO.Business.add(50000, "DYB", "DYB com", "logo_url", "DYB.com", "Paris", "1", "100-200", "status");
    let Business = await DAO.Business.getByUserId(50000);

    expect(typeof(Business)).not.toBe("boolean");

    if(typeof(Business) != "boolean") {
      expect(typeof(Id)).toBe("number");
      expect(Id).toBeGreaterThan(0);
      expect(Business.id).toBe(Id);
      expect(Business.user_id).toBe(50000);
      expect(Business.company_name).toBe("DYB");
      expect(Business.description).toBe("DYB com");
      expect(Business.logo).toBe("logo_url");
      expect(Business.website).toBe("DYB.com");
      expect(Business.location).toBe("Paris");
      expect(Business.industry).toBe("1");
      expect(Business.size).toBe("100-200");
      expect(Business.status).toBe("status");
    }

    var query = `Delete from Business where id = ${Id}`;
    await connection.promise().query(query);
  })
})

// describe("Update Business", () => {
//   test("Set with given data",async () => {
//     let Id = await DAO.Business.add(60000, "DYB", "DYB com", "logo_url", "DYB.com", "Paris", "1", "100-200", "status");
//     await DAO.Business.update(60000, "BYD", true, "logo", "BYD com", "Lyon", 0, "1-5", "BYD.com", "update");

//     let Business = await DAO.Business.getByUserId(60000);

//     console.log(Business);
//     expect(typeof(Business)).not.toBe("boolean");

//     if(typeof(Business) != "boolean") {
//       expect(Business.user_id).toBe(60000);
//       expect(Business.company_name).toBe("BYD");
//       expect(Business.description).toBe("BYD com");
//       expect(Business.logo).toBe("logo");
//       expect(Business.website).toBe("BY.com");
//       expect(Business.location).toBe("Lyon");
//       expect(Business.industry).toBe("0");
//       expect(Business.size).toBe("1-5");
//       expect(Business.status).toBe("update");
//     }

//     var query = `Delete from Business where id = ${Id}`;
//     await connection.promise().query(query);
//   })
// })

describe("Increments the number of views", () => {
  test("increment ProfileViews", async () => {
    var query = `Select profileViews from Business where user_id=412;`;
    let [prevValue] = await connection.promise().query(query);

    await DAO.Business.incrementProfileViews(412);

    var query = `Select profileViews from Business where user_id=412;`;
    let [currentValue] = await connection.promise().query(query);

    expect(currentValue[0].profileViews).toBe(prevValue[0].profileViews + 1);
  })
})