import { Transaction } from "src/payment/entities/transaction.entity";
import { usersMap } from "./users.data";
import {v4 as uuid} from "uuid";

const preTransactions = [
    {
        user: usersMap["user1"],
        merchantId: 'merchant1',
        merchant_name: 'Merchant1',
        merchant_address: 'Address1',
        telephone: '123456789',
        merchant_url: 'http://merchant1.com',
        transactionState: 'APPROVED',
        message: 'Transaction successful',
        referenceCode: '4965777e-0bc7-426c-80d1-663a2efa31ed',
        reference_pol: 'reference_pol',
        transactionId: 'transaction1',
        description: 'Transaction description',
        lapPaymentMethod: 'Credit Card',
        TX_VALUE: 20000,
        TX_TAX: 0,
        currency: 'USD',
        buyerEmail: 'user1@example.com',
        processingDate: new Date(),
        
    }
]

const transactions: Transaction[] = preTransactions.map((transaction) => {return {id: uuid(), ...transaction}})

export default transactions;