import {DAO} from "../../lib/dao";
import mysql, { RowDataPacket } from "mysql2";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";
import { Message, Conversation } from "../../types/types";

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

/**
 * test for getByOtherUser function of Messages class
*/
describe("Gets all messages between one user and another", () => {
  test("get messages by other user",async () => {
    let messages: Array<Message> = await DAO.Messages.getByOtherUser(71, 168);

    expect(messages[0].id).not.toBeNull();
    expect(messages[0].sender).not.toBeNull();
    expect(messages[0].receiver).not.toBeNull();
    expect(messages[0].text).not.toBeNull();
    expect(messages[0].read).not.toBeNull();
    expect(messages[0].notified).not.toBeNull();
    expect(messages[0].timestamp).not.toBeNull();
  })
})

/**
 * test for add function of Messages class
*/
describe("Adds a new message to the database", () => {
  test("Add a message",async () => {
    let Id = await DAO.Messages.add(71, 168, "This is one for the test");
    let message = await DAO.Messages.getById(Id.toString())

    expect(typeof(Id)).toBe("number");
    expect(typeof(message)).not.toBe("boolean")
    if(typeof(message) != "boolean") {
      expect(Id).toBeGreaterThan(0);
      expect(message.id).toBe(Id);
      expect(message.sender).toBe(71);
      expect(message.receiver).toBe(168);
      expect(message.text).toBe("This is one for the test");
      expect(message.read).toBe("0");
      expect(message.notified).toBe("0");
    }
    
    //Post-test cleanup
    var query = `Delete from messages where id = ${Id}`;
    await connection.promise().query(query);
  })
})

/**
 * test for getConversations function of Messages class
*/
describe("Gets all conversations from the given user", () => {
  test("get conversations",async () => {
    let conversations: Array<Conversation> = await DAO.Messages.getConversations(71);

    if (conversations.length > 0) {
      expect(conversations[0].id).not.toBeNull();
      expect(conversations[0].email).not.toBeNull();
      expect(conversations[0].username).not.toBeNull();
      expect(conversations[0].location).not.toBeNull();
      expect(conversations[0].logo).not.toBeNull();
    }
  })
})

/**
 * test for updateNotifyForSentMessage function of Messages class
*/
describe("Updates notified flag", () => {
  test("update notify",async () => {
    let message = await DAO.Messages.getById("900")
    expect(typeof(message)).not.toBe("boolean")

    if(typeof(message) != "boolean") {
      let originValue = message.notified;

      await DAO.Messages.updateNotifyForSentMessage(900);
      message = await DAO.Messages.getById("900")
      
      if(typeof(message) != "boolean") {
        expect(message.notified).toBe(true);
      }

      //Post-test cleanup
      var recoverQuery ="UPDATE messages SET `notified` = ? WHERE id = 900";
      await connection.promise().query(recoverQuery, [originValue ? 1 : 0]);
    }
  })
})

/**
 * test for updateReadMessage function of Messages class
*/
describe("Updates read flag to read message", () => {
  test("update read",async () => {
    var query = `Select messages.read from messages where sender = 71 AND receiver = 168`;
    let [values] = await connection.promise().query(query);
    let originValue: string = values[0].read;

    await DAO.Messages.updateReadMessage({sender: 71, receiver: 168});
    var query = `Select * from messages where sender = 71 AND receiver = 168`;
    let [messages] = await connection.promise().query(query);

    expect(messages[0].read).toBe('1');

    // var recoverQuery ="UPDATE messages SET `read` = " + originValue + " WHERE sender = 71 AND receiver = 168";
    // await connection.promise().query(recoverQuery);
  })
})

