
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const pool = require('./db')
const { BMRcal } = require('./BMR calculation');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
});

async function fetchMenus() {
    const query = 'SELECT menu FROM DCT';
    const [rows] = await pool.query(query);
    return rows.map(row => row.menu).join(', ');
}
function getBMRInfo(UID) {
    return new Promise((resolve, reject) => {
        const req = { query: { UID } }; // Simulate the Express req object
        const res = {
            json: (data) => resolve(data), // Capture JSON response
            status: function(responseStatus) {
                // Capture and handle status method chaining
                return this;  
            },
            send: (data) => resolve(data), // Capture send response
            end: () => resolve(), // Handle end of response
            status( statusCode ) {
                this.statusCode = statusCode;
                return this;
            }
        };

        BMRcal(req, res, (err) => {
            if (err) reject(err);
        });
    });
}

const getDietPlan = async (req, res) => {
    const { UID } = req.query;

    try {
        const BMRInfo = await getBMRInfo(UID);
        console.log(BMRInfo);
        const menus = await fetchMenus(); // You'll need to define this function to fetch menu items from your database

        const prompt = `Create a well-balanced diet plan using the following menu: ${menus}. ` +
                       `Target daily intake: ${BMRInfo[0]} calories, ${BMRInfo[1]} grams carbohydrates, ` +
                       `${BMRInfo[3]} grams fat, and ${BMRInfo[2]} grams protein. For the nutrition info of menus, just make a prediction. Make sure the sum of the calories of foods add up to the target calorie. Return the response in the following json format:
                       [
                       {
                        mid: '1'
                        menu:"1 serving of certain menu",
                        calorie: "calories in kcal",
                        carbs: "carbohydrates in gram",
                        protein: "protein in gram",
                        fat: "fat in gram"
                       },
                       {
                        mid: '2'
                        menu:"1 serving of certain menu",
                        calorie: "calories in kcal",
                        carbs: "carbohydrates in gram",
                        protein: "protein in gram",
                        fat: "fat in gram"
                       }
                    ]
                      mid stands for menu id. can you assign mid to each menu in order of 1, 2, 3, .... ? don't say anything else than this json format. Even for the json format, don't add the title.`;
                       
      
  
       const response = await openai.chat.completions.create( {
            model:"gpt-4",
            messages:[{"role": "user", "content": prompt}]
     } );
        const parsableJSONresponse = response.choices[0].message.content;
        const menurecommend = JSON.parse(parsableJSONresponse)
        res.json(menurecommend);
    } catch (error) {
        console.error('Error generating diet plan', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getDietPlan
  };
  