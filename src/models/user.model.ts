import { PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import db from '../database';
import User from '../types/user.type';
import config from '../config';

const hashPassword = (password: string): string => {
  const salt: number = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};
class UserModel {
  // create new user
  async create(user: User): Promise<User> {
    try {
      // connection
      const connection: PoolClient = await db.connect();
      // sql query
      const sql: string = `INSERT INTO users (user_name, first_name, last_name, email, password) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id, user_name, first_name, last_name, email `;
      // execute query
      const result = await connection.query(sql, [
        user.user_name,
        user.first_name,
        user.last_name,
        user.email,
        hashPassword(user.password),
      ]);
      // release connection
      connection.release();
      // return user
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create user: ${error}`);
    }
  }

  // get all users
  async getAll(): Promise<User[]> {
    try {
      const connection: PoolClient = await db.connect();
      const sql: string = `SELECT id, user_name, first_name, last_name, email FROM users`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at retrieving users ${(error as Error).message}`);
    }
  }
  // get specific user
  async getOne(id: string): Promise<User> {
    try {
      const connection: PoolClient = await db.connect();
      const sql: string = `SELECT id, user_name, first_name, last_name, email
     FROM users WHERE id=($1)`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Error at retrieving user with id: ${id} ${(error as Error).message}`,
      );
    }
  }
  // update specific user
  async updateOne(user: User, id: string): Promise<User> {
    try {
      const connection: PoolClient = await db.connect();
      const sql: string = `UPDATE users SET user_name=$1, first_name=$2, last_name=$3, email=$4, password=$5
     WHERE id=$6 RETURNING id, user_name, first_name, last_name, email`;
      const result = await connection.query(sql, [
        user.user_name,
        user.first_name,
        user.last_name,
        user.email,
        hashPassword(user.password),
        user.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error at updating user ${(error as Error).message}`);
    }
  }
  // delete user
  async deleteOne(id: string): Promise<void> {
    try {
      const connection: PoolClient = await db.connect();
      const sql: string = `DELETE FROM users WHERE id=$1`;
      await connection.query(sql, [id]);
      connection.release();
      return;
    } catch (error) {
      throw new Error(`Error at deleting user ${(error as Error).message}`);
    }
  }
  // authenticate user
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const connection: PoolClient = await db.connect();
      const sql: string = `SELECT password FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword,
        );
        if (isPasswordValid) {
          const userInfo = await connection.query(
            `SELECT id, user_name, first_name, last_name FROM users WHERE email = $1`,
            [email],
          );
          return userInfo.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }
}
export default UserModel;
