const neo4j = require("neo4j-driver");
require("dotenv").config();
const { URL, DB_USERNAME, DB_PASSWORD, DB } = process.env;
const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result =
      await session.run(`MATCH (follower:User {id: '${id}'})-[:Follows]->(followed:User)
      MATCH (followed)-[:Wrote]->(post:Post)
      WHERE NOT ()<-[:AnswerTo]-(post)
      WITH post, followed.id AS authorId, followed.login AS author
      RETURN post, authorId, author
      
      UNION
      
      MATCH (user:User {id: '${id}'})-[:Wrote]->(post:Post)
      WHERE NOT ()<-[:AnswerTo]-(post)
      RETURN post, user.id AS authorId, user.login AS author
      
    `);
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

const findAllComments = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result =
      await session.run(`MATCH (follower:User {id: '${id}'})-[:Follows]->(followed:User)
      MATCH (followed)-[:Wrote]->(comment:Post)-[:AnswerTo]->(post:Post)
      WITH comment, followed.id AS authorId, followed.login AS author, post.id AS postId
      RETURN comment, authorId, author, postId
      
      UNION
      
      MATCH (user:User {id: '${id}'})-[:Wrote]->(comment:Post)-[:AnswerTo]->(post:Post)
      RETURN comment, user.id AS authorId, user.login AS author, post.id AS postId
    `);
    const records = result.records.map((record) => {
      const commentProperties = record.get("comment").properties;
      const author = record.get("author");
      const authorId = record.get("authorId");
      const postId = record.get("postId");
      return { ...commentProperties, author, authorId, postId };
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
      `MATCH (user:User)-[:Wrote]->(post:Post {id : '${id}'}) RETURN user.login AS author, post LIMIT 1`
    );
    const records = result.records.map((record) => {
      const author = record.get("author");
      const post = record.get("post").properties;
      return { ...post, author };
    });
    return records[0];
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

const createPost = async (post) => {
  const createPostQuery = `
    MATCH (user:User {login: '${post.author}'})
    CREATE (user)-[:Wrote]->(post:Post {id: '${post.id}', body: '${post.body}'})
  `;
  const session = driver.session({ database: DB });

  try {
    await session.run(createPostQuery);
    return await findById(post.id);
  } finally {
    await session.close();
  }
};

const createAnswer = async (answer, userId, answeredPostId) => {
  const createAnswerQuery = `
    MATCH (user:User {id: '${userId}'})
    CREATE (user)-[:Wrote]->(comment:Post {id: '${answer.id}', body: "${answer.body}"})
    WITH user, comment
    MATCH (post:Post {id: '${answeredPostId}'})
    CREATE (post)<-[:AnswerTo]-(comment)
  `;
  const session = driver.session({ database: DB });
  try {
    await session.run(createAnswerQuery);
    return await findById(answer.id);
  } finally {
    await session.close();
  }
};

module.exports = {
  findAll,
  findAllComments,
  findById,
  findPostsByUserId,
  createPost,
  createAnswer,
};
