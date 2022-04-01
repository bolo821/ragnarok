const mariaDB = require("./DB.js");

const UserData = function() {
  this.equipments = 0;
  this.costumes = 0;
  this.cards = 0;
}
module.exports = {
    findCharacterId: (account_id) => new Promise((resolve, reject) => {
        mariaDB.query('SELECT char_id from `char`' + ` WHERE account_id=${account_id}`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    }),
    
    getStorageData: account_id => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid, amount from `storage`' + ` WHERE account_id=${account_id}`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    }),
    
    getMasterStorageData: account_id => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid, amount from `master_storage`' + ` WHERE master_id=${account_id}`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    }),
    
    getInventoryData: char_id => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid, amount from `inventory`' + ` WHERE char_id=${char_id}`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    }),
    
    getCartInventoryData: char_id => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid, amount from `cart_inventory`' + ` WHERE char_id=${char_id}`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    }),

    getCards: () => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid from `panel_cards`', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    }),

    getCostumes: () => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid from `panel_costumes`', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    }),

    getEquipments: () => new Promise((resolve, reject) => {
        mariaDB.query('SELECT nameid from `panel_equipments`', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    }),
}