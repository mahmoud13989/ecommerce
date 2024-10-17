const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository')
class UsersRepository extends Repository{
    async create(attributes /*{ email :'user@user' , password : 'password'} */){
      attributes.id = this.randomId();
       
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attributes.password,salt,64);
        const record = {
          ...attributes,
          password:`${buffer.toString('hex')}.${salt}`
        }
        const records = await this.getAll();
        records.push(record);
        await this.writeAll(records);
        return record;
      }
      async comparePasswords(saved , supplied){
        const[hashed , salt] = saved.split('.');
        const hashedSuppliedBuffer = await scrypt(supplied,salt,64);
        return hashed === hashedSuppliedBuffer.toString('hex');
    }
}

module.exports = new UsersRepository ('users.json');


