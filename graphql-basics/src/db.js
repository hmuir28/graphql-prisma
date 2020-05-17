// Type definitions (schema)
// Scalar types - String, Boolean, Int, Float, ID

// Learnt "!" is to specify whether require a value or not
// hello within a Type Definition is considered aa a query

// Demo user data
const users = [{
  id: '1',
  name: 'harry muir',
  email: 'harry182894@gmail.com',
  age: 27,
}, {
  id: '2',
  name: 'test test 123',
  email: 'testtest123@gmail.com',
  age: 29,
}, {
  id: '3',
  name: 'test 2',
  email: 'test2@gmail.com',
  age: 19,
}];

// Demo post data
const posts = [{
  id: '1',
  title: 'this is a dummy post title (first)', 
  body: 'this is a dummy post body (first)',
  published: true,
  author: '1',
}, {
  id: '2',
  title: 'this is a dummy post title (second)', 
  body: 'this is a dummy post body (second)',
  published: false,
  author: '1',
}, {
  id: '3',
  title: 'this is a dummy post title (third)', 
  body: 'this is a dummy post body (third)',
  published: false,
  author: '1',
}];

// demo comment data
const comments = [{
  id: '1',
  text: 'This is my first comment...',
  author: '1',
  post: '1',
}, {
  id: '2',
  text: 'This is my second comment...',
  author: '1',
  post: '1',
}, {
  id: '3',
  text: 'This is my third comment...',
  author: '1',
  post: '2',
}, {
  id: '4',
  text: 'This is my fourth comment...',
  author: '2',
  post: '3',
}];

const db = {
  comments,
  users,
  posts,
};

export default db;
