class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            },
        }
        : {};

        console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}

        console.log(queryCopy)
        // removing Some Field For Category
        const removeField = ["keyword","psge","limit"];

        removeField.forEach(key => delete queryCopy[key]);

        // Filter for Price and Rating 

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`)

        console.log(queryCopy)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
        console.log(queryCopy)
    }
}

module.exports = ApiFeatures