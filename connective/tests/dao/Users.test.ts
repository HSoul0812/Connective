import {DAO} from "../../lib/dao";
import mysql from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { User } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

describe("Get by Id", () => {
    test("Get user by Id which exists",async () => {
        let User = await DAO.Users.getById(415);

        expect(typeof(User)).not.toBe("boolean");

        if(typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.is_signup_with_google).toBe(false);
            expect(User.show_on_discover).toBe(false);
        }
    })

    test("Get user by Id which does not exist",async () => {
        let User = await DAO.Users.getById(5);

        expect(typeof(User)).toBe("boolean");
        expect(User).toBe(false);
    })
})

describe("Get by email", () => {
    test("Get user by email which exists and has not verified email", async () => {
        let User = await DAO.Users.getByEmail("kkingsbe@gmail.com");

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if(typeof(User) != "boolean") { //Type guard
            //TODO: Make sure no null values, besides those null in db (check db to see which values can be null)
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
        }
    })

    //TODO: Implement
    test("Get user by email which does not exist", async () => {
        let User = await DAO.Users.getByEmail("abcdefg");

        //Make sure getByEmail does not find user
        expect(User).toBe(false);
    })

    test("Get user with verified email", async () => {
        let User = await DAO.Users.getByEmail("spreadmycode@outlook.com");

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.stripeID).not.toBeNull();
            expect(User.show_on_discover).not.toBeNull();
            expect(User.verification_timestamp).not.toBeNull();
            expect(User.send_code_attempt).not.toBeNull();
            expect(User.is_signup_with_google).toBe(false);
        }
    })

    test("Get user with no verified email", async () => {
        let User = await DAO.Users.getByEmail("kyguy@gmail.com");

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(false);
            expect(User.is_signup_with_google).toBe(false);
        }
    })

    test("Get user which has used google sso", async () => {
        let User = await DAO.Users.getByEmail("devispei@gmail.com");

        //Make sure getByEmail found user
        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.stripeID).not.toBeNull();
            expect(User.show_on_discover).not.toBeNull();
            expect(User.is_signup_with_google).toBe(true);
        }
    })
})

describe("Get All", () => {
    test("Get all users",async () => {
        let Users = await DAO.Users.getAll();

        expect(Users.length).toBeGreaterThan(0);
    })
})

describe("Get by Email and Verification Id", () => {
    test("Get user with existing email and verification_id",async () => {
        let User = await DAO.Users.getByEmailAndVerificationId("spreadmycode@outlook.com", "6f2d6c73-3831-4b88-8445-9b35c6363487");

        expect(typeof(User)).not.toBe("boolean")

        if (typeof(User) != "boolean") {
            expect(User.id).not.toBeNull();
            expect(User.username).not.toBeNull();
            expect(User.password_hash).not.toBeNull();
            expect(User.email).not.toBeNull();
            expect(User.verification_timestamp).not.toBeNull();
            expect(User.email_verified).toBe(true);
            expect(User.is_signup_with_google).toBe(false);
            expect(User.show_on_discover).toBe(true);
        }
    })
})

describe("Add new user", () => {
    test("Add new user with google SSO",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0");
        let User = await DAO.Users.getById(Id as number);

        expect(typeof(User)).not.toBe("boolean");

        if(typeof(User) != "boolean") {
            expect(typeof(Id)).toBe("number");
            expect(Id).toBeGreaterThan(0);
            expect(User.id).toBe(Id);
            expect(User.username).toBe("John Doe");
            expect(User.email).toBe("johndoe@xxx.com");
            expect(User.stripeID).toBe("acct_1MRTOGBRAJesAWt0");
            expect(User.email_verified).toBe(false);
            expect(User.is_signup_with_google).toBe(false);
            expect(User.show_on_discover).toBe(false);
        }

        //Post-test cleanup
        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })

    test("Add new user without google SSO",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        let User = await DAO.Users.getById(Id as number);

        expect(typeof(User)).not.toBe("boolean");

        if(typeof(User) != "boolean") {
            expect(typeof(Id)).toBe("number");
            expect(Id).toBeGreaterThan(0);
            expect(User.id).toBe(Id);
            expect(User.username).toBe("John Doe");
            expect(User.email).toBe("johndoe@xxx.com");
            expect(User.stripeID).toBe("acct_1MRTOGBRAJesAWt0");
            expect(User.email_verified).toBe(true);
            expect(User.is_signup_with_google).toBe(true);
            expect(User.show_on_discover).toBe(false);
        }

        //Post-test cleanup
        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })
})

describe("Update verification status", () => {
    test("Set status to true",async () => {
        await DAO.Users.updateVerificationStatus(true, "tikitaka.mou@gmail.com");
        let User = await DAO.Users.getByEmail("tikitaka.mou@gmail.com") as User;

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.verify_email_otp).toBeNull();
        expect(User.email_verified).toBe(true);
    })

    test("Set status to false",async () => {
        await DAO.Users.updateVerificationStatus(false, "tikitaka.mou@gmail.com");
        let User = await DAO.Users.getByEmail("tikitaka.mou@gmail.com") as User;

        expect(User.id).not.toBeNull();
        expect(User.username).not.toBeNull();
        expect(User.password_hash).not.toBeNull();
        expect(User.verify_email_otp).toBeNull();
        expect(User.email).not.toBeNull();
        expect(User.email_verified).toBe(false);
    })
})

describe("set otp code", () => {
    test("set verify_email_otp",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        await DAO.Users.setOtpCode("7777", "johndoe@xxx.com");
        let User = await DAO.Users.getByEmail("johndoe@xxx.com") as User;

        expect(User.verify_email_otp).toBe("7777");

        //Post-test cleanup
        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })
})

describe("update otp code", () => {
    test("update verify_email_otp and send_code_attempt",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        await DAO.Users.updateOtpCode("7777", 2, "johndoe@xxx.com");
        let User = await DAO.Users.getByEmail("johndoe@xxx.com") as User;

        expect(User.verify_email_otp).toBe("7777");
        expect(User.send_code_attempt).toBe(2);

        //Post-test cleanup
        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })
})

describe("update verification_id", () => {
    test("update verification_id",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        await DAO.Users.updateVerificationId("6f2d6c73-3831-4b88-8445-9b35c6363487", "johndoe@xxx.com");
        let User = await DAO.Users.getByEmail("johndoe@xxx.com") as User;

        expect(User.verification_id).toEqual("6f2d6c73-3831-4b88-8445-9b35c6363487");

        //Post-test cleanup
        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })
})

describe("update verification", () => {
    test("update verification",async () => {
        let Id = await DAO.Users.add("John Doe", "$2a$10$e6pO/qYuFpKBwSBQTbz6oO55baOWV4HZbl/tl57a2O8IBYNrk0Bqq", "johndoe@xxx.com", "acct_1MRTOGBRAJesAWt0", true);
        await DAO.Users.updateVerification("6f2d6c73-3831-4b88-8445-9b35c6363487", 2, "johndoe@xxx.com");
        let User = await DAO.Users.getByEmail("johndoe@xxx.com") as User;

        expect(User.verification_id).toEqual("6f2d6c73-3831-4b88-8445-9b35c6363487");
        expect(User.send_code_attempt).toEqual(2);

        var query = `Delete from Users where id = ${Id}`;
        await connection.promise().query(query);
    })
})

describe("get users by industry", () => {
    test("Get users by industry which exists",async () => {
        let Users = await DAO.Users.getByIndustry("1", "Individual");

        expect(typeof(Users)).not.toBe("boolean");

        if(typeof(Users) != "boolean") {
            expect(Users.length).toBeGreaterThan(0);
            let testUser = Users[0]
            expect(testUser.email).not.toBeNull()
            expect(testUser.name).not.toBeNull()
            expect(testUser.id).not.toBeNull()
        }
    })

    test("Get users by industry which does not exist",async () => {
        let Users = await DAO.Users.getByIndustry("5", "Individual");

        expect(typeof(Users)).toBe("boolean");
        expect(Users).toBe(false);
    })
})