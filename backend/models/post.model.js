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
      WHERE NOT ()<-[:Quotes]-(post)
      WITH post, followed.id AS authorId, followed.login AS author
      RETURN post, authorId, author
      
      UNION
      
      MATCH (user:User {id: '${id}'})-[:Wrote]->(post:Post)
      WHERE NOT ()<-[:Quotes]-(post)
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

const findAllQuotes = async (id) => {
  const session = driver.session({ database: DB });
  try {
    const result =
      await session.run(`MATCH (follower:User {id: '${id}'})-[:Follows]->(followed:User)
      MATCH (followed)-[:Wrote]->(quote:Post)-[:Quotes]->(post:Post)
      WITH quote, followed.id AS authorId, followed.login AS author, post.id AS postId
      RETURN quote, authorId, author, postId
      
      UNION
      
      MATCH (user:User {id: '${id}'})-[:Wrote]->(quote:Post)-[:Quotes]->(post:Post)
      RETURN quote, user.id AS authorId, user.login AS author, post.id AS postId
    `);
    const records = result.records.map((record) => {
      const quoteProperties = record.get("quote").properties;
      const author = record.get("author");
      const authorId = record.get("authorId");
      const postId = record.get("postId");
      return { ...quoteProperties, author, authorId, postId };
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

const createQuote = async (quote, userId, quotedPostId) => {
  const createQuoteQuery = `
    MATCH (user:User {id: '${userId}'})
    CREATE (user)-[:Wrote]->(quote:Post {id: '${quote.id}', body: "${quote.body}"})
    WITH user, quote
    MATCH (post:Post {id: '${quotedPostId}'})
    CREATE (post)<-[:Quotes]-(quote)
  `;
  const session = driver.session({ database: DB });
  try {
    await session.run(createQuoteQuery);
    return await findById(quote.id);
  } finally {
    await session.close();
  }
};

module.exports = {
  findAll,
  findAllQuotes,
  findById,
  findPostsByUserId,
  createPost,
  createQuote,
};
