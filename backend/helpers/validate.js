const Validator = require('validatorjs');
const Models = require("../models");
/**
 * Checks if incoming value already exist for unique and non-unique fields in the database
 * e.g email: required|email|exists:User,email
 */
Validator.registerAsync('exist', function(value,  attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);

    const { 0: table, 1: column } = attArr;
    let msg = (column == "username") ? `${column} has already been taken `: `${column} already in use`   
    Models[table].findAndCountAll({ where : { [column]: value }})
    .then((result) => {
        if(result.count > 0){
            passes(false, msg); // return false if value exists
            return;
        }
        passes();
    })
});
const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
Validator.register('valid_cnic', value => cnicRegex.test(value),
    'CNIC No must follow the XXXXX-XXXXXXX-X format!');
const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;