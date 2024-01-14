const neo4j = require("neo4j-driver");
require("dotenv").config();
const { URL, DB_USERNAME, DB_PASSWORD, DB } = process.env;
const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));
const session = driver.session({ DB });

const findAll = async () => {
  const transaction = session.beginTransaction();
  try {
    const result = await transaction.run(`Match (u:Post) RETURN u`);
    const records = result.records.map((record) => record.get("u").properties);
    await transaction.commit();
    return records;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findById = async (id) => {
  const transaction = session.beginTransaction();
  try {
    const result = await transaction.run(
      `MATCH (u:Post {id : '${id}'} ) RETURN u LIMIT 1`
    );
    const records = result.records[0].get("u").properties;
    await transaction.commit();
    return records;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const create = async (post) => {
  const createRelationQuery = `
    MATCH (user:User {login: '${post.author}'})
    CREATE (user)-[:Wrote]->(post:Post {id: '${post.id}', title: '${post.title}', body: '${post.body}''})
    RETURN post
  `;
  const transaction = session.beginTransaction();

  try {
    await transaction.run(createRelationQuery);
    await transaction.commit();
    return await findById(post.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  create,
};
