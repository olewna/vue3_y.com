const neo4j = require("neo4j-driver");
require("dotenv").config();
const { URL, DB_USERNAME, DB_PASSWORD, DB } = process.env;
const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async () => {
  const session = driver.session({ database: DB });

  try {
    const result = await session.run("MATCH (u:User) RETURN u");
    const records = result.records.map((record) => record.get("u").properties);
    return records;
  } finally {
    await session.close();
  }
};

const findFollowedUsers = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(
      `MATCH (u:User {id: '${id}'})-[:Follows]->(user:User) RETURN user`
    );
    const records = result.records.map(
      (record) => record.get("user").properties
    );
    return records;
  } finally {
    await session.close();
  }
};

const findNotFollowedUsers = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(
      `MATCH (u:User {id: '${id}'})
      MATCH (user:User)
      WHERE NOT (u)-[:Follows]->(user)
      RETURN user;`
    );
    const records = result.records.map(
      (record) => record.get("user").properties
    );
    return records;
  } finally {
    await session.close();
  }
};

const findById = async (id) => {
  const session = driver.session({ database: DB });

  try {
    const result = await session.run(
      `MATCH (u:User {id : '${id}'} ) RETURN u LIMIT 1`
    );
    const records = result.records[0].get("u").properties;
    return records;
  } finally {
    await session.close();
  }
};

const create = async (user) => {
  const session = driver.session({ database: DB });
  try {
    await session.run(
      `CREATE (u:User {id : '${user.id}', login: '${user.login}', email: '${user.email}', password: '${user.password}'} ) RETURN u`
    );
    return await findById(user.id);
  } finally {
    await session.close();
  }
};

const createFollowRelation = async (follows, isFollowed) => {
  const session = driver.session({ database: DB });
  try {
    await session.run(
      `MATCH (follower:User {id: '${follows}'), (following:User {id: '${isFollowed}')
      CREATE (follower)-[:Follows]->(following)
      RETURN follower, following;`
    );
    return await findById(follows);
  } finally {
    await session.close();
  }
};

const findByLoginOrEmail = async (login, email) => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(
      `MATCH (u:User) WHERE u.login = '${login}' OR u.email = '${email}' RETURN u;`
    );
    return result;
  } finally {
    await session.close();
  }
};

const findByEmail = async (email) => {
  const session = driver.session({ database: DB });

  try {
    const result = await session.run(
      `MATCH (u:User) WHERE u.email = '${email}' RETURN u;`
    );
    return result.records.length > 0
      ? result.records[0].get("u").properties
      : null;
  } finally {
    await session.close();
  }
};

module.exports = {
  findAll,
  findById,
  findFollowedUsers,
  findNotFollowedUsers,
  create,
  createFollowRelation,
  findByEmail,
  findByLoginOrEmail,
};
