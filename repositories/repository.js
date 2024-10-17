const fs = require('fs');
const crypto = require('crypto');


module.exports = class repository{
    constructor(filename){
        if (!filename){
            throw new Error ('a filename is required to make a repository');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err){
            fs.writeFileSync(this.filename , '[]');
        }
    }
    async create(attributes){
        attributes.id = this.randomId();
        const records = await this.getAll();
        records.push(attributes);
        await this.writeAll(records);
        return attributes;
    }
    async getAll(){
        const records = JSON.parse( await fs.promises.readFile(this.filename, {encoding : 'utf8'}));
        return records; 
    }
    
    
    async writeAll(records){
        return  fs.promises.writeFile(this.filename , JSON.stringify(records , null , 2));
    }
    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }
    async getOne(id){
        const records = await this.getAll();
        return records.find( record => record.id === id);
    }
    async getOneBy(filters){
        const records = await this.getAll();
        for (let record of records){
            let found = true ;
            for (let key in filters){
                if (record[key] !== filters[key])
                    found = false;
            }
            if (found)
                return record;
        }
    }
    async delete (id){
        const records = await this.getAll();
        const filterdRecords = records.filter( record => record.id !== id);
        await this.writeAll(filterdRecords);
    }
    async update(id, attributes){
        const records = await this.getAll();
        const record = records.find( record => record.id === id);
        if (!record)
                throw new Error(`a record with id: ${id} is not found`);
        Object.assign(record, attributes);
        await this.writeAll(records);    
    }
}