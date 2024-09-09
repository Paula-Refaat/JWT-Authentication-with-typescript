import db from '../database';
import User from '../types/user.type';

class UserModel {
  // create new user
  async create(user: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, name , email`;
      const result = await connection.query(sql, [
        user.email,
        user.name,
        user.password,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error while creating user: ${(error as Error).message}`);
    }
  }
  // get all user
  async getAll(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT id, name, email FROM users';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error while fetching users: ${(error as Error).message}`,
      );
    }
  }
  // get specific user
  async getById(id: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT id, name, email FROM users WHERE id = $1';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(
        `Error while fetching user by id:${id}, ${(error as Error).message}`,
      );
    }
  }
  // update user
  async update(id: string, user: User): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email`;
      const result = await connection.query(sql, [user.name, user.email, id]);
      connection.release();
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(
        `Error while updating user by id:${id}, ${(error as Error).message}`,
      );
    }
  }
  // delete user
  async delete(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = 'DELETE FROM users WHERE id = $1';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Error while deleting user by id:${id}, ${(error as Error).message}`,
      );
    }
  }
  // authenticate user
}

export default UserModel;
