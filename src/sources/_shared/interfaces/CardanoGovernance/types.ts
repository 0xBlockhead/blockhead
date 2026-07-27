import { type as arktype } from 'arktype'


const cardanoGovernanceJson = arktype.module({
	value: 'null | boolean | number | string | value[] | object',
	object: {
		'[string]': 'value',
	},
})

const cardanoGovernanceActionId = arktype({
	txId: 'string',
	govActionIx: 'number.integer >= 0',
}).onUndeclaredKey('reject')

const cardanoGovernanceCredential = arktype.or(
	arktype({
		keyHash: 'string',
	}).onUndeclaredKey('reject'),
	arktype({
		scriptHash: 'string',
	}).onUndeclaredKey('reject')
)

const cardanoGovernanceRewardAccount = arktype({
	network: "'Mainnet' | 'Testnet'",
	credential: cardanoGovernanceCredential,
}).onUndeclaredKey('reject')

const cardanoGovernanceWithdrawal = arktype([
	cardanoGovernanceRewardAccount,
	'number.integer >= 0',
])

const cardanoGovernanceProtocolVersion = arktype({
	major: 'number.integer >= 0',
	minor: 'number.integer >= 0',
}).onUndeclaredKey('reject')

const cardanoGovernanceUnitInterval = arktype({
	numerator: 'number.integer >= 0',
	denominator: 'number.integer > 0',
}).onUndeclaredKey('reject')

const cardanoGovernanceConstitution = arktype('object').and(
	arktype({
		anchor: arktype({
			url: 'string',
			dataHash: 'string',
		}).onUndeclaredKey('reject'),
		script: 'string | null',
	}).onUndeclaredKey('reject')
)

const cardanoParameterChange = arktype({
	tag: "'ParameterChange'",
	contents: [
		cardanoGovernanceActionId.or('null'),
		cardanoGovernanceJson.object,
		'string | null',
	],
}).onUndeclaredKey('reject')

const cardanoHardForkInitiation = arktype({
	tag: "'HardForkInitiation'",
	contents: [
		cardanoGovernanceActionId.or('null'),
		cardanoGovernanceProtocolVersion,
	],
}).onUndeclaredKey('reject')

const cardanoTreasuryWithdrawals = arktype({
	tag: "'TreasuryWithdrawals'",
	contents: [
		cardanoGovernanceWithdrawal.array(),
		'string | null',
	],
}).onUndeclaredKey('reject')

const cardanoNoConfidence = arktype({
	tag: "'NoConfidence'",
	contents: cardanoGovernanceActionId.or('null'),
}).onUndeclaredKey('reject')

const cardanoUpdateCommittee = arktype({
	tag: "'UpdateCommittee'",
	contents: [
		cardanoGovernanceActionId.or('null'),
		cardanoGovernanceCredential.array(),
		{
			'[string]': 'number.integer >= 0',
		},
		cardanoGovernanceUnitInterval,
	],
}).onUndeclaredKey('reject')

const cardanoNewConstitution = arktype({
	tag: "'NewConstitution'",
	contents: [
		cardanoGovernanceActionId.or('null'),
		cardanoGovernanceConstitution,
	],
}).onUndeclaredKey('reject')

const cardanoInfoAction = arktype({
	tag: "'InfoAction'",
}).onUndeclaredKey('reject')

const cardanoGovernanceActionTag = arktype({
	tag: "'ParameterChange' | 'HardForkInitiation' | 'TreasuryWithdrawals' | 'NoConfidence' | 'UpdateCommittee' | 'NewConstitution' | 'InfoAction'",
})

export type CardanoGovernanceAction =
	| typeof cardanoParameterChange.infer
	| typeof cardanoHardForkInitiation.infer
	| typeof cardanoTreasuryWithdrawals.infer
	| typeof cardanoNoConfidence.infer
	| typeof cardanoUpdateCommittee.infer
	| typeof cardanoNewConstitution.infer
	| typeof cardanoInfoAction.infer

export type CardanoGovernanceActionTag = CardanoGovernanceAction['tag']

export const parseCardanoGovernanceAction = (value: unknown): CardanoGovernanceAction => {
	switch (cardanoGovernanceActionTag.assert(value).tag) {
		case 'ParameterChange':
			return cardanoParameterChange.assert(value)
		case 'HardForkInitiation':
			return cardanoHardForkInitiation.assert(value)
		case 'TreasuryWithdrawals':
			return cardanoTreasuryWithdrawals.assert(value)
		case 'NoConfidence':
			return cardanoNoConfidence.assert(value)
		case 'UpdateCommittee':
			return cardanoUpdateCommittee.assert(value)
		case 'NewConstitution':
			return cardanoNewConstitution.assert(value)
		case 'InfoAction':
			return cardanoInfoAction.assert(value)
	}
}
