import { Account } from '../src/modules/account/AccountModel';

export async function seedATM() {
	const exists = await Account.findOne({ name: 'ATM' });

	if (!exists) {
		const atm = await Account.create({
			name: 'ATM',
			balance: 1000000000000,
		});

		console.log('ATM Account for test purposes created!');

		return atm._id.toString();
	}

	return null;
}
