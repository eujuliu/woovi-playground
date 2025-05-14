import { Account } from '../src/modules/account/AccountModel';

export async function seedATM() {
	const exists = await Account.findOne({ name: 'ATM' });

	if (!exists) {
		const atm = await Account.create({
			_id: '6813be8ec913920947a086fc',
			name: 'ATM',
			balance: 1000000000000,
		});

		console.log('ATM Account for test purposes created!');

		return atm._id.toString();
	}

	return null;
}
