const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const UserData = require('../../models/UserData');

router.get('/:account_id', auth, async (req, res) => {
    const { account_id } = req.params;

    try {
        const storageData = await UserData.getStorageData(account_id);
        const masterData = await UserData.getMasterStorageData(account_id);
        const characters = await UserData.findCharacterId(account_id);
    
        let inventoryData = [];
        for (let i=0; i<characters.length; i++) {
            let invData = await UserData.getInventoryData(characters[i].char_id);
            inventoryData = [ ...inventoryData, ...invData ];
            let cartInvData = await  UserData.getCartInventoryData(characters[i].char_id);
            inventoryData = [ ...inventoryData, ...cartInvData ];
        }
    
        const totalData = [ ...storageData, ...masterData, ...inventoryData ];
    
        let cards = await UserData.getCards();
        let costumes = await UserData.getCostumes();
        let equipments = await UserData.getEquipments();
    
        cards = cards.map(ele => ele.nameid);
        costumes = costumes.map(ele => ele.nameid);
        equipments = equipments.map(ele => ele.nameid);
    
        let card = 0, costume = 0, equipment = 0;

        for (let i=0; i<totalData.length; i++) {
            if (cards.includes(totalData[i].nameid)) card += totalData[i].amount;
            else if (costumes.includes(totalData[i].nameid)) costume += totalData[i].amount;
            else if (equipments.includes(totalData[i].nameid)) equipment += totalData[i].amount;
        }
    
        res.json({
            card,
            costume,
            equipment,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
        });
    }
});

module.exports = router;
