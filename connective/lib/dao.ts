import moment from 'moment'
import mysql, { OkPacket, RowDataPacket } from 'mysql2'
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import {
  Message,
  User,
  DiscoverUser,
  Business as Business_Type,
  Individual as Individual_Type,
  ListItem,
  UnreadNotification,
  StripePrice,
  Conversation,
  Industry,
  Occupation,
  TruncatedUser,
} from '../types/types'

export namespace DAO {
  const connection = mysql.createConnection(process.env.DATABASE_URL || '')

  /**
   * Contains functions for interacting with Users in the database
   */
  export class Users {
    /**
     * Gets a user by their id
     * @param {number} id The users email
     * @returns {User | boolean} The user object, or false if not found
     */
    static async getById(id: number): Promise<User | boolean> {
      var query = `SELECT * FROM Users WHERE id=?;`
      var [results] = await connection.promise().query(query, [id])

      if (Array.isArray(results) && results.length == 0) return false
      var selectedUser = results[0]
      if (typeof selectedUser == 'undefined') return false

      const result = {
        ...results[0],
        email_verified: results[0].email_verified == 1,
        is_signup_with_google: results[0].is_signup_with_google == 1,
        show_on_discover: results[0].show_on_discover == 1,
      } as User
      return result
    }

    /**
     * Gets a user by their email
     * @param {string} email The users email
     * @returns {User | boolean} The user object, or false if not found
     */
    static async getByEmail(email: string): Promise<User | boolean> {
      // var query = `SELECT * FROM Users JOIN Business on User.id = Business.userid WHERE email=?; `

      var query = `SELECT PROFILE.user_id, PROFILE.location, PROFILE.user_name, PROFILE.logo, Users.* FROM (
            SELECT user_id,  location, company_name AS user_name, logo 
              FROM Business 
            UNION ALL 
            SELECT user_id,  location, NAME AS user_name, profile_picture AS logo
              FROM Individual
           ORDER BY user_id 
          ) as PROFILE
          INNER JOIN Users ON Users.id = PROFILE.user_id WHERE email=?;`

      var [results] = await connection.promise().query(query, [email])
      if (Array.isArray(results) && results.length == 0) return false
      var selectedUser = results[0]
      if (typeof selectedUser == 'undefined') return false

      const result = {
        ...selectedUser,
        email_verified: selectedUser.email_verified == 1,
        is_signup_with_google: selectedUser.is_signup_with_google == 1,
        show_on_discover: selectedUser.show_on_discover == 1,
      } as User
      return result
    }

    /**
     * Gets all users
     * @returns {User[]}
     */
    static async getAll(): Promise<User[]> {
      var query = `SELECT * FROM Users;`
      var [results] = await connection.promise().query(query)

      const result = (results as Array<RowDataPacket>).map((value) => {
        return {
          ...value,
          email_verified: value.email_verified == 1,
          is_signup_with_google: value.is_signup_with_google == 1,
          show_on_discover: value.show_on_discover == 1,
        } as User
      })
      return result
    }

    /**
     * Gets a user by their email and verification id
     * @param {string} email The users email
     * @param {string} verificationId The users verification id
     * @returns {User | boolean} The user object, or false if not found
     */
    static async getByEmailAndVerificationId(
      email: string,
      verificationId: string,
    ): Promise<User | boolean> {
      var query = `SELECT * FROM Users WHERE email=? AND verification_id=?;`
      var [results] = await connection
        .promise()
        .query(query, [email, verificationId])

      if (Array.isArray(results) && results.length == 0) return false
      var selectedUser = results[0]
      if (typeof selectedUser == 'undefined') return false

      const result = {
        ...results[0],
        email_verified: results[0].email_verified == 1,
        is_signup_with_google: results[0].is_signup_with_google == 1,
        show_on_discover: results[0].show_on_discover == 1,
      } as User
      return result
    }

    /**
     * Adds a new user to the database
     * @param {string} username The users username
     * @param {string} password_hash The users hashed password
     * @param {string} email The users email
     * @param {string} stripeID The users stripe id
     * @param {boolean} isSignupWithGoogle The user signed up with Google SSO
     * @returns {number | boolean} The users insert id, or false if the insert failed
     */
    static async add(
      username: string,
      password_hash: string,
      email: string,
      stripeID: string,
      is_subscribed: boolean = false,
      isSignupWithGoogle: boolean = false,
    ): Promise<number | boolean> {
      var query = `INSERT INTO Users (username, password_hash, email, stripeID, is_subscribed) VALUES (?,?,?,?,?);`
      if (isSignupWithGoogle) {
        query = `INSERT INTO Users (username, password_hash, email, stripeID, is_subscribed, email_verified, is_signup_with_google) VALUES (?,?,?,?,?,?,?);`
        var [result] = await connection
          .promise()
          .execute<OkPacket>(query, [
            username,
            password_hash,
            email,
            stripeID,
            Number(is_subscribed),
            1,
            1,
          ])
        return result.insertId
      } else {
        try {
          var [result] = await connection
            .promise()
            .execute<OkPacket>(query, [
              username,
              password_hash,
              email,
              stripeID,
              Number(is_subscribed),
            ])
          return result.insertId
        } catch (e) {
          console.log('DAO.Users.add:')
          console.log(e)
          return false
        }
      }
    }

    /**
     * Updates the email verification status of the given user
     * @param {boolean} status The new verification status of the user
     * @param {string} email The users email
     */
    static async updateVerificationStatus(
      status: boolean,
      email: string,
    ): Promise<void> {
      var query = `UPDATE Users SET verify_email_otp = null, email_verified = ? WHERE email=?;`
      await connection.promise().execute(query, [status == true ? 1 : 0, email])
    }

    /**
     * Sets the one time passcode for the given user by their email
     * @param {string} code The new OTP code
     * @param {string} email The users email
     */
    static async setOtpCode(code: string, email: string): Promise<void> {
      var query = `UPDATE Users SET verify_email_otp = ? WHERE email=?;`
      await connection.promise().execute(query, [code, email])
    }

    /**
     * Updates the one time passcode for a user, as well as the # of attempts for the given user
     * @param {string} code The new OTP code
     * @param {number} sendCodeAttempt The number of attempts which have occured
     * @param {string} email The users email
     */
    static async updateOtpCode(
      code: string,
      sendCodeAttempt: number,
      email: string,
    ): Promise<void> {
      var query = `UPDATE Users SET verify_email_otp = ?, send_code_attempt = ?, last_code_sent_time = ? WHERE email=?;`
      await connection
        .promise()
        .query(query, [
          code,
          sendCodeAttempt,
          moment().format('YYYY/MM/DD HH:mm:ss'),
          email,
        ])
    }

    /**
     * Updates the password hash value for a user
     * @param {string} hash The new password hash
     * @param {string} email The users email
     */
    static async updatePasswordHash(
      hash: string,
      email: string,
    ): Promise<void> {
      await connection
        .promise()
        .query(
          `UPDATE Users SET password_hash='${hash}' WHERE email='${email}';`,
        )
    }

    /**
     * Updates the password hash value and verification id for a user
     * @param {string} hash The new password hash
     * @param {string} verificationId The new verification id
     * @param {string} email The users email
     */
    static async updatePasswordHashAndVerificationId(
      hash: string,
      verificationId: string,
      email: string,
    ): Promise<void> {
      await connection
        .promise()
        .query(
          `UPDATE Users SET password_hash='${hash}', verification_id = '${verificationId}' WHERE email='${email}';`,
        )
    }

    /**
     * Updates the verification id value for a user
     * @param {string} verificationId The new verification id
     * @param {string} email The users email
     */
    static async updateVerificationId(
      verificationId: string,
      email: string,
    ): Promise<void> {
      await connection
        .promise()
        .query(
          `UPDATE Users SET verification_id = '${verificationId}', verification_timestamp = "${moment().format(
            'YYYY/MM/DD HH:mm:ss',
          )}" WHERE email='${email}';`,
        )
    }

    /**
     * Updates the verification status for a user
     * @param {string} token The new password hash
     * @param {string} sendCodeAttempt The sending code attempt
     * @param {string} email The users email
     */
    static async updateVerification(
      token: string,
      sendCodeAttempt: number,
      email: string,
    ): Promise<void> {
      await connection
        .promise()
        .query(
          `UPDATE Users SET verification_id = '${token}', send_code_attempt = ${sendCodeAttempt}, verification_timestamp = "${moment().format(
            'YYYY/MM/DD HH:mm:ss',
          )}" WHERE email='${email}';`,
        )
    }

    /**
     * Gets a users by their industry
     * @param {string} industry The users industry
     * @param {string} profile The users profile
     * @returns {Array<TruncatedUser> | boolean} An array of Users, or false if not found
     */
    static async getByIndustry(
      industry: string,
      profile: string,
    ): Promise<Array<TruncatedUser> | boolean> {
      const query = `SELECT ${profile}.user_id, ${profile}.name, Users.email FROM ${profile} INNER JOIN Users ON ${profile}.user_id = Users.id WHERE industry='${industry}'`
      const [users] = await connection.promise().query(query)

      if (Array.isArray(users) && users.length == 0) {
        return false
      }

      return users as TruncatedUser[]
    }
  }

  export class Discover {
    /**
     *
     * @returns {DiscoverUser[]} All users who are displayed on the discover page
     */
    static async getAll(): Promise<Array<DiscoverUser>> {
      var query = `SELECT Users.show_on_discover, Users.id, Users.email, Business.industry, Business.company_name as username, Business.logo, Business.description, Business.status FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.show_on_discover, Users.id, Users.email, Individual.industry, Individual.name as username, Individual.profile_picture AS logo, Individual.bio AS description, Individual.status FROM Users JOIN Individual on Users.id = Individual.user_id;`
      var [results] = await connection.promise().query(query)

      const result = (results as Array<RowDataPacket>).map((value) => {
        return {
          ...value,
          show_on_discover: value.show_on_discover == 1,
        } as DiscoverUser
      })

      return result
    }
  }

  /**
   * Contains functions for interacting with Businesses in the database
   */
  export class Business {
    /**
     * Determines if a user is a business
     * @param {number} id The users id
     * @returns {boolean} True if the user is a business
     */
    static async isBusiness(id: number): Promise<boolean> {
      var query = `SELECT COUNT(id) FROM Business WHERE user_id=?;`
      let [res] = await connection.promise().query(query, [id])

      return res[0]['count(id)'] > 0
    }

    /**
     * Gets a business by its user id
     * @param {number} userId The businesses user id
     * @returns {Business | boolean} A Business object representing the business, or false if not found
     */
    static async getByUserId(userId: number): Promise<Business_Type | boolean> {
      var query = `SELECT b.*, u.is_subscribed FROM Business b, Users u WHERE u.id = b.user_id and b.user_id=?;`
      var [result] = await connection.promise().query(query, [userId])

      if (Array.isArray(result) && result.length == 0) return false
      var selectedBusiness = result[0]

      return selectedBusiness as Business_Type
    }

    /**
     * Adds a new business to the database
     * @param {number} userId The businesses user id
     * @param {string} name The businesses name
     * @param {string} description The businesses description
     * @param {string} pfp A link to the businesses profile picture
     * @param {string} url The businesses site url
     * @param {string} location
     * @param {string} industry
     * @param {string} size
     * @param {string} status
     * @returns
     */
    static async add(
      userId: number,
      name: string,
      description: string,
      pfp: string,
      url: string,
      location: string,
      industry: string,
      size: string,
      status: string,
    ): Promise<number> {
      var query = `INSERT INTO Business (
                            user_id, company_name, description, logo, website, location, industry, size, status
                        ) VALUES (
                            ?, ?, ?, ?, ?, ?, ?, ?, ?
                        );`
      var [result] = await connection
        .promise()
        .execute<OkPacket>(query, [
          userId,
          name,
          description,
          pfp,
          url,
          location,
          industry,
          size,
          status,
        ])

      return result.insertId
    }

    /**
     * Updates the information for the given business
     * @param {number} userId The businesses user id
     * @param {string} name The new name for the businesses
     * @param {boolean} pfpChanged Weather or not there is a profile picture
     * @param {string} pfp The profile picture for the businesses
     * @param {string} description The new description for the business
     * @param {string} location The new location of the business
     * @param {number} industry The new industry of the business (a number relating to a specific label)
     * @param {string} size The size of the business
     * @param {string} url The new site url of the business
     * @param {string} status The new status for the business
     */
    static async update(
      userId: number,
      name: string,
      pfpChanged: boolean,
      pfp: string,
      description: string,
      location: string,
      industry: number,
      size: string,
      url: string,
      status: string,
      isSubscribed: boolean,
    ): Promise<void> {
      var query = `UPDATE Business INNER JOIN Users ON Users.id = Business.user_id SET Business.company_name = ?, Business.logo = ?, Business.description = ?, Business.location = ?, Business.industry = ?, Business.size = ?, Business.website = ?, Business.status = ?, Users.is_subscribed = ? WHERE Business.user_id = ?;`
      await connection
        .promise()
        .execute(query, [
          name,
          pfpChanged ? `${pfp}` : '',
          description,
          location,
          industry,
          size,
          url,
          status,
          Number(isSubscribed),
          userId,
        ])
    }

    /**
     * Increments the number of views for the given business by their user id
     * @param userId The users ID
     */
    static async incrementProfileViews(userId: number): Promise<void> {
      var query =
        'UPDATE Business SET profileViews = profileViews + 1 WHERE user_id=?;'
      await connection.promise().execute(query, [userId])
    }
  }

  /**
   * Contains functions for interacting with Individuals in the database
   */
  export class Individual {
    /**
     * Determines if a user is an individual
     * @param {number} id The individuals user id
     * @returns {boolean} True if the user is an individual
     */
    static async isIndividual(id: number): Promise<boolean> {
      var query = `SELECT COUNT(id) FROM Individual WHERE user_id=?;`
      let [res] = await connection.promise().query(query, [id])

      return res[0]['count(id)'] > 0
    }

    /**
     * Gets an individual by its user id
     * @param {number} userId The individuals user id
     * @returns {Individual | boolean} An Indivual object representing the individual, or false if not found
     */
    static async getByUserId(
      userId: number,
    ): Promise<Individual_Type | boolean> {
      var query = `SELECT i.*, u.is_subscribed FROM Individual i, Users u WHERE u.id = i.user_id and i.user_id=?;`
      var [result] = await connection.promise().query(query, [userId])

      if (Array.isArray(result) && result.length == 0) return false

      return result[0] as Individual_Type
    }

    /**
     * Adds a new individual to the database
     * @param {number} userId The individual user id
     * @param {string} name The individual name
     * @param {string} bio The individual bio
     * @param {string} pfp A link to the individual profile picture
     * @param {string} location location
     * @param {number} profileViews profile views count
     * @param {number} listViews list views count
     * @param {string} industry
     * @param {string} status
     * @param {string} occupation
     * @returns
     */
    static async add(
      userId: number,
      name: string,
      bio: string,
      pfp: string,
      location: string,
      profileViews: number,
      listViews: number,
      industry: string,
      status: string,
      occupation: string,
    ): Promise<number> {
      var query = `INSERT INTO Individual (
                            user_id, name, bio, profile_picture, location, profileViews, listViews, status, industry, occupation
                        ) VALUES (
                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                        );`
      var [result] = await connection
        .promise()
        .execute<OkPacket>(query, [
          userId,
          name,
          bio,
          pfp,
          location,
          profileViews,
          listViews,
          status,
          industry,
          occupation,
        ])

      return result.insertId
    }

    /**
     * Update individual user data
     * @param userId
     * @param pfpChanged
     * @param pfp
     * @param name
     * @param bio
     * @param location
     * @param status
     * @param is_subscribed
     */
    static async update(
      userId: number,
      pfpChanged: boolean,
      pfp: string,
      name: string,
      bio: string,
      location: string,
      status: string,
      isSubscribed: boolean,
    ): Promise<void> {
      let query = ''
      if (pfpChanged) {
        query = `UPDATE Individual i, Users u SET i.name = '${name}', ${
          pfpChanged ?? 'i.profile_picture =' + `'${pfp}',`
        } i.bio = '${bio}', i.location = '${location}', i.status = '${status}', u.is_subscribed = '${Number(
          isSubscribed,
        )}' WHERE u.id = i.user_id and i.user_id = '${userId}';`
      } else {
        query = `UPDATE Individual i, Users u SET i.name = '${name}', i.bio = '${bio}', i.location = '${location}', i.status = '${status}', u.is_subscribed = '${Number(
          isSubscribed,
        )}' WHERE u.id = i.user_id and i.user_id = '${userId}';`
      }
      await connection.promise().execute(query)
    }

    /**
     * Increments the number of views for the given individual by their user id
     * @param userId The users ID
     */
    static async incrementProfileViews(userId: number): Promise<void> {
      var query =
        'UPDATE Individual SET profileViews = profileViews + 1 WHERE user_id=?;'
      await connection.promise().execute(query, [userId])
    }
  }

  /**
   * Contains functions for interacting with List in the database
   */
  export class Lists {
    /**
     * Gets all urls from lists
     * @returns urls array
     */
    static async getUrls(): Promise<Array<string>> {
      const [lists] = await connection.promise().query(`SELECT url FROM Lists`)
      const urls: Array<string> = (lists as Array<RowDataPacket>).map(
        (list) => {
          return list.url
        },
      )
      return urls
    }

    /**
     * Gets purchased list by the specific buyer id
     * @param buyerId The buyers Id
     * @returns Purchased list for buyer
     */
    static async getPurchasedListByBuyerId(
      buyerId: number,
    ): Promise<Array<ListItem>> {
      const query = `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id WHERE buyer_id = ${buyerId}`
      const [purchasedListsResults] = await connection.promise().query(query)

      const result = (purchasedListsResults as Array<RowDataPacket>).map(
        (value) => {
          return { ...value, published: value.published } as ListItem
        },
      )
      return result
    }

    /**
     * Gets purchased list by the specific creator id
     * @param creatorId The creators Id
     * @returns Purchased list for creator
     */
    static async getPurchasedListByCreatorId(
      creatorId: number,
    ): Promise<Array<ListItem>> {
      const query = `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id WHERE creator = ${creatorId}`
      const [soldListResults] = await connection.promise().query(query)

      const result = (soldListResults as Array<RowDataPacket>).map((value) => {
        return { ...value, published: value.published } as ListItem
      })
      return result
    }

    /**
     * Gets list by the specific creator id
     * @param creatorId The creators Id
     * @returns List for the creators
     */
    static async getListsByCreator(
      creatorId: number,
    ): Promise<Array<ListItem>> {
      const query = `select * from Lists where creator = ${creatorId}`
      const [createdListResults] = await connection.promise().query(query)

      const result = (createdListResults as Array<RowDataPacket>).map(
        (value) => {
          return { ...value, published: value.published } as ListItem
        },
      )
      return result
    }

    /**
     * Get stripe price for the specific list item
     * @param id list id
     * @returns
     */
    static async getListStripePrice(id: number): Promise<StripePrice> {
      var [result] = await connection
        .promise()
        .query(
          `SELECT Lists.price, Users.stripeID FROM Lists INNER JOIN Users ON Lists.creator = Users.id WHERE Lists.id="${id}"`,
        )
      return result[0] as StripePrice
    }
  }

  /**
   * Contains functions for interacting with Messages in the database
   */
  export class Messages {
    /**
     * Gets all messages between one user and antoher
     * @param {number} userId The first users id
     * @param {number} otherId The second users id
     * @returns {Message[]} An array of Message objects representing the conversation
     */
    static async getByOtherUser(
      userId: number,
      otherId: number,
    ): Promise<Array<Message>> {
      var query = `SELECT * FROM messages WHERE sender=? and receiver=? UNION ALL SELECT * FROM messages WHERE receiver=? and sender=?;`
      var [results] = await connection
        .promise()
        .query(query, [userId, otherId, userId, otherId])

      const result = (results as Array<RowDataPacket>).map(
        (value: RowDataPacket) => {
          return {
            ...value,
            notified: value.notified == 1,
            read: value.read == 1,
          } as Message
        },
      )

      return result
    }

    /**
     * Adds a new message to the database
     * @param {number} senderId The user id of the message sender
     * @param {number} receiverId The user id of the message receiver
     * @param {string} text The text content within the message
     * @returns {number} The messages insert id
     */
    static async add(
      senderId: number,
      receiverId: number,
      text: string,
    ): Promise<number> {
      var query =
        `INSERT INTO messages (` +
        '`sender`' +
        `, ` +
        '`receiver`' +
        `, ` +
        '`text`' +
        `, ` +
        '`read`' +
        `, ` +
        '`notified`' +
        `) VALUES (?, ?, ?, '0', '0')`
      var [result] = await connection
        .promise()
        .query<OkPacket>(query, [senderId, receiverId, text])

      return result.insertId
    }

    /**
     * Gets all conversations from the given user
     * @param {number} userId The users id
     * @returns An array of conversations
     */
    static async getConversations(userId: number): Promise<Conversation[]> {
      var query1 = `SELECT distinct profile.id, profile.email, profile.username, profile.location, profile.logo
        FROM(
          (
            SELECT Users.id, Users.email, Business.company_name as username, Business.location, Business.logo
              FROM Users JOIN Business on Users.id = Business.user_id
            UNION ALL
            SELECT Users.id, Users.email, Individual.name as username, Individual.location, Individual.profile_picture AS logo
              FROM Users JOIN Individual on Users.id = Individual.user_id
          ) as profile
          JOIN (select distinct sender, receiver from messages where sender = ? or receiver = ? ) as mes
        ) where (profile.id = mes.sender or profile.id = mes.receiver) and profile.id != ?;`
      var [conversations] = await connection
        .promise()
        .query<RowDataPacket[]>(query1, [userId, userId, userId])
      // var query1 = `select distinct sender, receiver from messages where sender = ? union all select distinct sender, receiver from messages where receiver = ?;`;
      // var [uniqueMessagesQuery] = await connection
      //   .promise()
      //   .query<RowDataPacket[]>(query1, [userId, userId]);

      // var query2 = `SELECT Users.id, Users.email, Business.company_name as username, Business.location, Business.logo FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.id, Users.email, Individual.name as username, Individual.location, Individual.profile_picture AS logo FROM Users JOIN Individual on Users.id = Individual.user_id;`;
      // var [profiles] = await connection
      //   .promise()
      //   .query<RowDataPacket[]>(query2);
      // //console.log(profiles.map(profile => profile.id))
      // let conversationProfiles = [];
      // uniqueMessagesQuery.forEach((message) => {
      //   conversationProfiles.push(
      //     profiles.filter(
      //       (profile) =>
      //         profile.id == message.sender || profile.id == message.receiver
      //     )
      //   );
      // });
      // //console.log(conversationProfiles)
      // let conversations = [];
      // conversationProfiles.forEach((conversation) => {
      //   let otherUser = conversation.filter((user) => user.id != userId)[0];
      //   if (typeof otherUser != "undefined") {
      //     if (
      //       conversations.filter(
      //         (conversation) => conversation.id == otherUser.id
      //       ).length == 0
      //     ) {
      //       conversations.push(otherUser);
      //     }
      //   }
      // });
      return conversations as Conversation[]
    }

    /**
     * Gets all conversations from the given user
     * @param {number} userId The users id
     * @returns An array of conversations
     */
    static async getConversationsWithUnReadCount(
      userId: number,
    ): Promise<Conversation[]> {
      var query1 = `SELECT 
      * 
    FROM 
      (
        SELECT 
          PROFILE.username, 
          PROFILE.location, 
          PROFILE.logo, 
          Users.id, 
          Users.email, 
          messages.timestamp, 
          ROW_NUMBER() OVER(
            PARTITION BY Users.email 
            ORDER BY 
              TIMESTAMP desc
          ) rn 
        FROM 
          (
            SELECT 
              Business.user_id, 
              Business.company_name as username, 
              Business.location, 
              Business.logo 
            FROM 
              Business 
            UNION ALL 
            SELECT 
              Individual.user_id, 
              Individual.name as username, 
              Individual.location, 
              Individual.profile_picture AS logo 
            FROM 
              Individual
          ) as PROFILE 
          INNER JOIN Users ON Users.id = PROFILE.user_id 
          INNER JOIN messages ON messages.sender = Users.id 
          OR messages.receiver = Users.id 
        WHERE 
          (
            messages.sender = ? 
            OR messages.receiver = ?
          ) 
          AND Users.id != ? 
        ORDER BY 
          messages.timestamp
      ) result 
    WHERE 
      rn = 1
    `
      var [conversations] = await connection
        .promise()
        .query<RowDataPacket[]>(query1, [userId, userId, userId, userId])
      return conversations as Conversation[]
    }

    /**
     * Gets all unread & unnotified messages accross all users
     * @returns {{id: number, email: string}[]} All unread and unnotified messages
     */
    static async getUnnotified(): Promise<Array<UnreadNotification>> {
      var query =
        "SELECT messages.id, Users.email FROM messages LEFT JOIN Users ON Users.id=`receiver` WHERE `read`='0' AND messages.timestamp < DATE_SUB(NOW(), interval 2 minute) AND `notified` ='0' ORDER BY timestamp DESC;"
      var [messages] = await connection.promise().query(query)

      return messages as Array<UnreadNotification>
    }

    /**
     * Updates notified flag to present sent
     * @param id message id
     */
    static async updateNotifyForSentMessage(id: number): Promise<void> {
      await connection
        .promise()
        .query("UPDATE messages SET `notified`='1' WHERE id =" + id + ';')
    }

    /**
     * Updates read flag to read message
     * @param {sender, receiver} ids of sender and receiver
     */
    static async updateReadMessage({
      sender,
      receiver,
    }: {
      sender: number
      receiver: number
    }): Promise<void> {
      await connection
        .promise()
        .query(
          'UPDATE messages SET `read` = "1" WHERE sender=? AND receiver=?',
          [sender, receiver],
        )
    }

    /**
     * Gets a message by its id
     * @param {string} id The messages id
     */
    static async getById(id: string): Promise<Message | boolean> {
      var query = `SELECT * from messages where id = ?`
      let [res] = (await connection
        .promise()
        .query<OkPacket>(query, [id])) as RowDataPacket[]

      try {
        const message = {
          ...res,
          notified: res.notified == 1,
          read: res.read == 1,
        } as Message

        return message
      } catch (e) {
        return false
      }
    }
  }

  /**
   * Contains functions for interacting with Industries in the database
   */
  export class Industries {
    /**
     * Gets all Industries
     * @returns {Industry[]}
     */
    static async getAll(): Promise<Industry[]> {
      var query = `SELECT ind.id, ind.name, occ.id as occupation_id, occ.name as occupation_name FROM industries AS ind left outer JOIN occupations AS occ on ind.id = occ.industry_id`
      var [results] = await connection.promise().query(query)

      var temp_id: number = -1 // Id for comparison
      var result: Industry[] = []
      var temp: Occupation[] = []

      for (let i = 0; i < (results as Array<RowDataPacket>).length; i++) {
        if (results[i].id != temp_id) {
          if (temp_id != -1) {
            result.push({
              id: results[i - 1].id,
              name: results[i - 1].name,
              occupations: temp,
              typename: 'Industry',
            })
            temp = []
          }
          temp.push({
            id: -1,
            name: 'Other',
            typename: 'Occupation',
          })
          if (results[i].occupation_id && results[i].occupation_name) {
            temp.push({
              id: results[i].occupation_id,
              name: results[i].occupation_name,
              typename: 'Occupation',
            })
          }
          temp_id = results[i].id
        } else {
          temp.push({
            id: results[i].occupation_id,
            name: results[i].occupation_name,
            typename: 'Occupation',
          })
        }
        if (i === (results as Array<RowDataPacket>).length - 1) {
          result.push({
            id: results[i].id,
            name: results[i].name,
            occupations: temp,
            typename: 'Industry',
          })
          temp = []
        }
      }

      return result
    }
  }
}
