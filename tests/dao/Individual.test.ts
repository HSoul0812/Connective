import {DAO} from "../../lib/dao";
import mysql, { RowDataPacket } from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { Individual } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

describe("Determines if a user is a Individual", () => {
  test("check with user which is Individual",async () => {
      let isIndividual = await DAO.Individual.isIndividual(437);

      expect(isIndividual).toBe(true);
  })

  test("check with user which is not Individual",async () => {
      let isIndividual = await DAO.Individual.isIndividual(412);

      expect(isIndividual).toBe(false);
  })
})

describe("Get a Individual by Id", () => {
  test("Get Individual by Id which exists",async () => {
    let Individual = await DAO.Individual.getByUserId(437);

    expect(typeof(Individual)).not.toBe("boolean");

    if(typeof(Individual) != "boolean") {
      expect(Individual.id).not.toBeNull();
      expect(Individual.user_id).not.toBeNull();
      expect(Individual.name).not.toBeNull();
      expect(Individual.bio).not.toBeNull();
      expect(Individual.profile_picture).not.toBeNull();
      expect(Individual.location).not.toBeNull();
      expect(Individual.status).not.toBeNull();
      expect(Individual.industry).not.toBeNull();
      expect(Individual.occupation).not.toBeNull();
    }
  })

  test("Get Individual by Id which not exist",async () => {
    let Individual = await DAO.Individual.getByUserId(412);

    expect(typeof(Individual)).toBe("boolean");
    expect(Individual).toBe(false);
  })
})

describe("Add new Individual", () => {
  test("Add new Individual",async () => {
    let Id = await DAO.Individual.add(70000, "DYB", "DYB ind", "logo_url", "Paris", 2, 3, "ind", "status", "occ");
    let Individual = await DAO.Individual.getByUserId(70000);

    expect(typeof(Individual)).not.toBe("boolean");

    if(typeof(Individual) != "boolean") {
      expect(typeof(Id)).toBe("number");
      expect(Id).toBeGreaterThan(0);
      expect(Individual.id).toBe(Id);
      expect(Individual.user_id).toBe(70000);
      expect(Individual.name).toBe("DYB");
      expect(Individual.bio).toBe("DYB ind");
      expect(Individual.profile_picture).toBe("logo_url");
      expect(Individual.location).toBe("Paris");
      expect(Individual.profileViews).toBe(2);
      expect(Individual.listViews).toBe(3);
      expect(Individual.industry).toBe("ind");
      expect(Individual.occupation).toBe("occ");
      expect(Individual.status).toBe("status");
    }

    var query = `Delete from Individual where id = ${Id}`;
    await connection.promise().query(query);
  })
})

// // describe("Update Individual", () => {
// //   test("Set with given data",async () => {
// //     let Id = await DAO.Individual.add(60000, "DYB", "DYB com", "logo_url", "DYB.com", "Paris", "1", "100-200", "status");
// //     await DAO.Individual.update(60000, "BYD", true, "logo", "BYD com", "Lyon", 0, "1-5", "BYD.com", "update");

// //     let Individual = await DAO.Individual.getByUserId(60000);

// //     console.log(Individual);
// //     expect(typeof(Individual)).not.toBe("boolean");

// //     if(typeof(Individual) != "boolean") {
// //       expect(Individual.user_id).toBe(60000);
// //       expect(Individual.company_name).toBe("BYD");
// //       expect(Individual.description).toBe("BYD com");
// //       expect(Individual.logo).toBe("logo");
// //       expect(Individual.website).toBe("BY.com");
// //       expect(Individual.location).toBe("Lyon");
// //       expect(Individual.industry).toBe("0");
// //       expect(Individual.size).toBe("1-5");
// //       expect(Individual.status).toBe("update");
// //     }

// //     var query = `Delete from Individual where id = ${Id}`;
// //     await connection.promise().query(query);
// //   })
// // })

describe("Increments the number of views", () => {
  test("increment ProfileViews", async () => {
    var query = `Select profileViews from Individual where user_id=437;`;
    let [prevValue] = await connection.promise().query(query);

    await DAO.Individual.incrementProfileViews(437);

    var query = `Select profileViews from Individual where user_id=437;`;
    let [currentValue] = await connection.promise().query(query);

    expect(currentValue[0].profileViews).toBe(prevValue[0].profileViews + 1);
  })
})