const Income= require("../models/Income");
const Expense= require("../models/Expense");
const {isValidObjectId, Types} = require("mongoose");

//Get the dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId= req.user.id;
        const userObjectId= new Types.ObjectId(userId);

        //fetching the total income and expense
        const totalIncome = await Income.aggregate([
            {$match: {userId: userObjectId}},
            {$group: {_id:null, total: {$sum: "$amount"}}}
        ]);

        console.log(totalIncome, {userId: userObjectId});

        const totalExpense = await Expense.aggregate([
            {$match: {userId: userObjectId}},
            {$group: {_id:null, total: {$sum: "$amount"}}}
        ]); 

        //Getting income transaction in the last 60 days
        const last60DaysIncomeTransaction = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Getting total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransaction.reduce((sum, transaction) => sum + transaction.amount, 0);

        //Getting expense transaction in the last 30 days
        const last30DaysExpenseTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Getting total expense for last 30 days
        const expenseLast30Days = last30DaysExpenseTransaction.reduce((sum, transaction) => sum + transaction.amount, 0);       

        //Fetching last 5 transactions (income + expense)   
        const lastTransactions = [
            ...await Income.find({userId}).sort({date: -1}).limit(5).then(arr => arr.map(txn => ({...txn.toObject(), type: "income"}))),
            ...await Expense.find({userId}).sort({date: -1}).limit(5).then(arr => arr.map(txn => ({...txn.toObject(), type: "expense"})))
        ].sort((a, b) => b.date - a.date); //Sorting the latest first

        // Final response
        res.json({
            totalBalance:
            (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0, 
            last30daysExpense :{
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransaction,
            },
            last60DaysIncome:{
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransaction,
            },
            recentTransactions: lastTransactions,
        });
    } catch(error) {
        res.status(500).json({message: "Server Error", error});
    }
}

