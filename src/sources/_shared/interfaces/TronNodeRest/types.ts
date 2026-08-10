import {
	type as arktype,
	type Type,
} from 'arktype'

export type TronNodeContractValue = {
	amount?: number | string
	asset_name?: string
	contract_address?: string
	owner_address?: string
	to_address?: string
}

export const tronNodeContractValueWire = arktype({
	'amount?': 'number | string',
	'asset_name?': 'string',
	'contract_address?': 'string',
	'owner_address?': 'string',
	'to_address?': 'string',
}).and(arktype('Record<string, unknown>'))

export type TronNodeTransaction = {
	txID?: string
	ret?: {
		contractRet?: string
		fee?: number
	}[]
	raw_data?: {
		contract?: {
			type?: string
			parameter?: {
				value?: TronNodeContractValue
			}
		}[]
		expiration?: number
		timestamp?: number
		data?: string
	}
	raw_data_hex?: string
	signature?: string[]
}

export const tronNodeTransactionWire = arktype({
	'txID?': 'string',
	'ret?': arktype({
		'contractRet?': 'string',
		'fee?': 'number.integer >= 0',
	}).array(),
	'raw_data?': {
		'contract?': arktype({
			'type?': 'string',
			'parameter?': {
				'value?': tronNodeContractValueWire,
			},
		}).and(arktype('Record<string, unknown>')).array(),
		'expiration?': 'number.integer >= 0',
		'timestamp?': 'number.integer >= 0',
		'data?': 'string',
	},
	'raw_data_hex?': 'string',
	'signature?': 'string[]',
}).and(arktype('Record<string, unknown>'))

export type TronNodeBlock = {
	blockID?: string
	block_header?: {
		raw_data?: {
			number?: number
			timestamp?: number
			txTrieRoot?: string
			parentHash?: string
			witness_address?: string
			version?: number
		}
		witness_signature?: string
	}
	transactions?: TronNodeTransaction[]
}

export const tronNodeBlockWire = arktype({
	'blockID?': 'string',
	'block_header?': {
		'raw_data?': {
			'number?': 'number.integer >= 0',
			'timestamp?': 'number.integer >= 0',
			'txTrieRoot?': 'string',
			'parentHash?': 'string',
			'witness_address?': 'string',
			'version?': 'number.integer',
		},
		'witness_signature?': 'string',
	},
	'transactions?': tronNodeTransactionWire.array(),
}).and(arktype('Record<string, unknown>'))

export type TronNodeWitness = {
	address: string
	url?: string
	voteCount?: number | string
	totalProduced?: number | string
	totalMissed?: number | string
	latestBlockNum?: number | string
	isJobs?: boolean
}

export const tronNodeWitnessWire = arktype({
	address: 'string',
	'url?': 'string',
	'voteCount?': 'number | string',
	'totalProduced?': 'number | string',
	'totalMissed?': 'number | string',
	'latestBlockNum?': 'number | string',
	'isJobs?': 'boolean',
}).and(arktype('Record<string, unknown>'))

export type TronNodeWitnesses = {
	witnesses: TronNodeWitness[]
}

export const tronNodeWitnessesWire = arktype({
	witnesses: tronNodeWitnessWire.array(),
}) satisfies Type<TronNodeWitnesses>

export type TronNodeChainParameters = {
	chainParameter: {
		key: string
		value?: number | string
	}[]
}

export const tronNodeChainParametersWire = arktype({
	chainParameter: arktype({
		key: 'string',
		'value?': 'number | string',
	}).array(),
})

export type TronNodeInfo = {
	block?: string
	solidityBlock?: string
	currentConnectCount?: number
	activeConnectCount?: number
	passiveConnectCount?: number
}

export const tronNodeInfoWire = arktype({
	'block?': 'string',
	'solidityBlock?': 'string',
	'currentConnectCount?': 'number.integer >= 0',
	'activeConnectCount?': 'number.integer >= 0',
	'passiveConnectCount?': 'number.integer >= 0',
}).and(arktype('Record<string, unknown>'))

export type TronNodeAccount = {
	address?: string
	account_name?: string
	balance?: number
	create_time?: number
	latest_opration_time?: number
	free_net_usage?: number
	net_usage?: number
	account_resource?: {
		energy_usage?: number
	}
}

export const tronNodeAccountWire = arktype({
	'address?': 'string',
	'account_name?': 'string',
	'balance?': 'number.integer >= 0',
	'create_time?': 'number.integer >= 0',
	'latest_opration_time?': 'number.integer >= 0',
	'free_net_usage?': 'number.integer >= 0',
	'net_usage?': 'number.integer >= 0',
	'account_resource?': {
		'energy_usage?': 'number.integer >= 0',
	},
}).and(arktype('Record<string, unknown>'))

export type TronNodeAccountResource = {
	freeNetUsed?: number
	freeNetLimit?: number
	NetUsed?: number
	NetLimit?: number
	EnergyUsed?: number
	EnergyLimit?: number
}

export const tronNodeAccountResourceWire = arktype({
	'freeNetUsed?': 'number.integer >= 0',
	'freeNetLimit?': 'number.integer >= 0',
	'NetUsed?': 'number.integer >= 0',
	'NetLimit?': 'number.integer >= 0',
	'EnergyUsed?': 'number.integer >= 0',
	'EnergyLimit?': 'number.integer >= 0',
}).and(arktype('Record<string, unknown>'))

export type TronNodeTransactionInfo = {
	id?: string
	blockNumber?: number
	blockTimeStamp?: number
	fee?: number
	contractResult?: string[]
	contract_address?: string
	resMessage?: string
	log?: Record<string, unknown>[]
	internal_transactions?: Record<string, unknown>[]
	receipt?: {
		result?: string
		energy_usage?: number
		origin_energy_usage?: number
		energy_usage_total?: number
		energy_fee?: number
		energy_penalty_total?: number
		net_usage?: number
		net_fee?: number
	}
}

export const tronNodeTransactionInfoWire = arktype({
	'id?': 'string',
	'blockNumber?': 'number.integer >= 0',
	'blockTimeStamp?': 'number.integer >= 0',
	'fee?': 'number.integer >= 0',
	'contractResult?': 'string[]',
	'contract_address?': 'string',
	'resMessage?': 'string',
	'log?': arktype('Record<string, unknown>').array(),
	'internal_transactions?': arktype('Record<string, unknown>').array(),
	'receipt?': {
		'result?': 'string',
		'energy_usage?': 'number.integer >= 0',
		'origin_energy_usage?': 'number.integer >= 0',
		'energy_usage_total?': 'number.integer >= 0',
		'energy_fee?': 'number.integer >= 0',
		'energy_penalty_total?': 'number.integer >= 0',
		'net_usage?': 'number.integer >= 0',
		'net_fee?': 'number.integer >= 0',
	},
}).and(arktype('Record<string, unknown>'))
