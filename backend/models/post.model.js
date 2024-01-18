const neo4j = require("neo4j-driver");
require("dotenv").config();
const { URL, DB_USERNAME, DB_PASSWORD, DB } = process.env;
const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const session = driver.session({ DB });

const findAll = async () => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(`MATCH (post:Post)<-[:Wrote]-(user:User)
    RETURN post, user.login AS author, user.id AS authorId`);
    const records = result.records.map((record) => {
      const postProperties = record.get("post").properties;
      const author = record.get("author");
      const authorId = record.get("authorId");
      return { ...postProperties, author, authorId };
    });
    return records;
  } finally {
    await session.close();
  }
};

const findById = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(
      `MATCH (u:Post {id : '${id}'} ) RETURN u LIMIT 1`
    );
    const records = result.records[0].get("u").properties;
    return records;
  } finally {
    await session.close();
  }
};

const findPostsByUserId = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result = await session.run(
      `MATCH (user:User {id: '${id}'})-[:Wrote]->(post:Post)
      RETURN post, user.login AS author`
    );
    const records = result.records.map((record) => {
      const postProperties = record.get("post").properties;
      const author = record.get("author");
      return { ...postProperties, author };
    });
    return records;
  } finally {
    await session.close();
  }
};

const create = async (post) => {
  const createRelationQuery = `
    MATCH (user:User {login: '${post.author}'})
    CREATE (user)-[:Wrote]->(post:Post {id: '${post.id}', body: '${post.body}'})
    RETURN post
  `;
  const session = driver.session({ database: DB });

  try {
    await session.run(createRelationQuery);
    return await findById(post.id);
  } finally {
    await session.close();
  }
};

module.exports = {
  findAll,
  findById,
  findPostsByUserId,
  create,
};
