import { graphql } from 'graphql';
import { schema } from '../schema/schema';
import { getContext } from '../server/getContext';
import { Account } from '../modules/account/AccountModel';

describe('TRANSACTION MUTATION', () => {
	const mutation = `
    mutation TransactionAdd(
      $input: TransactionAddInput!
    ) {
        TransactionAdd(input: $input) {
            transaction {
                id
                senderId
                receiverId
                amount
            }
        }
    }`;

	it('should create a new transaction', async () => {
		const sender = await new Account({
			name: 'Account 1',
			balance: 100,
		}).save();
		const receiver = await new Account({
			name: 'Account 2',
			balance: 0,
		}).save();

		const variables = {
			input: {
				senderId: sender._id.toString(),
				receiverId: receiver._id.toString(),
				amount: 100,
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		const updatedSender = await Account.findById(sender._id);

		expect(result).not.toHaveProperty('errors');
		expect(result.data.TransactionAdd.transaction.amount).toBe(100);
		expect(updatedSender).not.toBeNull();
		expect(updatedSender?.balance).toBe(0);
	});

	it('should not be possible to sender send balance for himself', async () => {
		const sender = await new Account({
			name: 'Account 1',
			balance: 100,
		}).save();

		const variables = {
			input: {
				senderId: sender._id.toString(),
				receiverId: sender._id.toString(),
				amount: 100,
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
		expect(result.data.TransactionAdd).toBeNull();
	});

	it('should not be possible to send balance without balance', async () => {
		const sender = await new Account({
			name: 'Account 1',
			balance: 0,
		}).save();
		const receiver = await new Account({
			name: 'Account 2',
			balance: 0,
		}).save();

		const variables = {
			input: {
				senderId: sender._id.toString(),
				receiverId: receiver._id.toString(),
				amount: 100,
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('INSUFFICIENT_BALANCE');
		expect(result.data.TransactionAdd).toBeNull();
	});
});
