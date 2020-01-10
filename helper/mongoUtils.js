const commonMongoUtils = {};

// insert record
commonMongoUtils.insert = (model, obj) => {
    try {
        return model.create(obj);
    } catch (err) {
        return err;
    }
}

//  find one record
commonMongoUtils.checkExist = (model, obj) => {
    try {
        return model.findOne(obj);
    } catch (err) {
        return err;
    }
}

// find one and update
commonMongoUtils.findAndUpdate = (model, filterObj, updateObj) => {
    try {
        return model.findOneAndUpdate(filterObj, updateObj);
    } catch (err) {
        return err;
    }
}

// find all record
commonMongoUtils.getData = (model, obj, selectedField) => {
    try {
        return model.find(obj, selectedField);
    } catch (err) {
        return err;
    }
}
module.exports = commonMongoUtils;