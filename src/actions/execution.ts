import { type } from 'arktype'
import { stringify } from 'devalue'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import { EvmAddress, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'


const nonnegativeBigint = type('bigint').narrow((value) => value >= 0n)

export const actionRevisionBinding = type({
	sessionId: 'string > 0',
	actionId: 'string > 0',
	contentRevisionHash: Hash32,
}).onUndeclaredKey('reject')

export const authorityRequestEnvelope = type.or(
	type({
		adapterKey: "'evm.transaction'",
		adapterVersion: "'1'",
		value: type({
			method: "'eth_sendTransaction'",
			chainId: 'number.integer > 0',
			accountAddress: EvmAddress,
			calls: type({
				'toAddress?': EvmAddress,
				'value?': 'bigint',
				inputData: ZeroExHex,
				inputDataHash: Hash32,
			}).onUndeclaredKey('reject').array().atLeastLength(1),
			'simulationEvidenceHash?': Hash32,
			'stateBlockNumber?': nonnegativeBigint,
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'ton.internal-message-sign'",
		adapterVersion: "'1'",
		value: type({
			namespace: "'ton'",
			reference: 'string > 0',
			accountAddress: 'string > 0',
			method: "'signMessage'",
			network: 'string > 0',
			from: 'string > 0',
			'valid_until?': 'number.integer >= 0',
			messages: type({
				address: 'string > 0',
				amount: 'string > 0',
				'payload?': 'string > 0',
				'stateInit?': 'string > 0',
				'extra_currency?': type({
					'[string]': 'string > 0',
				}).onUndeclaredKey('reject'),
			}).onUndeclaredKey('reject').array().atLeastLength(1),
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'evm.personal-sign'",
		adapterVersion: "'1'",
		value: type({
			chainId: 'number.integer > 0',
			accountAddress: EvmAddress,
			message: 'string',
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'ton.transaction'",
		adapterVersion: "'1'",
		value: type({
			method: "'sendTransaction'",
			validUntil: 'number.integer >= 0',
			'network?': 'string > 0',
			'from?': 'string > 0',
			messages: type({
				address: 'string > 0',
				amountNano: 'string > 0',
				'stateInit?': 'string > 0',
				'payload?': 'string > 0',
			}).onUndeclaredKey('reject').array().atLeastLength(1),
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'wallet.message-sign'",
		adapterVersion: "'1'",
		value: type.or(
			type({
				namespace: "'aptos'",
				method: "'aptos:signMessage'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'bip122'",
				method: "'signMessage'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'cip34'",
				method: "'signData'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'cosmos'",
				method: "'signArbitrary'",
				chainId: 'string > 0',
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'solana'",
				method: "'solana:signMessage'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'sui'",
				method: "'sui:signPersonalMessage'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject'),
			type({
				namespace: "'tron'",
				method: "'personal_sign'",
				accountAddress: 'string > 0',
				message: 'string',
			}).onUndeclaredKey('reject')
		),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'evm.typed-data'",
		adapterVersion: "'1'",
		value: type({
			chainId: 'number.integer > 0',
			accountAddress: EvmAddress,
			typedDataJson: 'string',
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject')
)

export type ActionAuthorityRequestEnvelope = typeof authorityRequestEnvelope.infer

export const actionAuthorityRequestEnvelopeHash = (
	envelope: ActionAuthorityRequestEnvelope
) => Hash32.assert(Hash.sha256(Hex.fromString(stringify(envelope))))

export const authorityDecision = type.or(
	type({
		kind: "'denied'",
		decidedAt: 'number.integer >= 0',
		reason: 'string',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'cancelled'",
		decidedAt: 'number.integer >= 0',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'prepared-without-dispatch'",
		decidedAt: 'number.integer >= 0',
	}).onUndeclaredKey('reject')
)

export const dispatchAddress = type({
	kind: "'wallet-connection'",
	connectionKey: 'string > 0',
	method: type.enumerated(
		'aptos:signMessage',
		'eth_sendTransaction',
		'eth_signTypedData_v4',
		'personal_sign',
		'sendTransaction',
		'signArbitrary',
		'signData',
		'signMessage',
		'solana:signMessage',
		'sui:signPersonalMessage'
	),
}).onUndeclaredKey('reject')

const dispatchResponse = type.or(
	type({
		adapterKey: "'evm.transaction'",
		adapterVersion: "'1'",
		value: type({
			transactionIds: Hash32.array(),
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'evm.signature'",
		adapterVersion: "'1'",
		value: type({
			signatureHash: Hash32,
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'wallet.signature'",
		adapterVersion: "'1'",
		value: type({
			namespace: type.enumerated('aptos', 'bip122', 'cip34', 'cosmos', 'solana', 'sui', 'tron'),
			signatureHash: Hash32,
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject'),
	type({
		adapterKey: "'ton.internal-message-sign'",
		adapterVersion: "'1'",
		value: type({
			internalBocHash: Hash32,
		}).onUndeclaredKey('reject'),
	}).onUndeclaredKey('reject')
)

export type ActionDispatchResponse = typeof dispatchResponse.infer

export const dispatchEvidence = type.or(
	type({
		kind: "'pre-dispatch-failure'",
		error: 'string > 0',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'definite-rejection'",
		error: 'string > 0',
		'code?': 'number',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'returned'",
		response: dispatchResponse,
	}).onUndeclaredKey('reject'),
	type({
		kind: "'ambiguous'",
		reason: type.enumerated('timeout', 'transport-disconnected', 'response-unreadable'),
		'error?': 'string > 0',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'response-audit-failure'",
		response: dispatchResponse,
		error: 'string > 0',
	}).onUndeclaredKey('reject'),
	type({
		kind: "'response-audit-failure'",
		returnedValueHash: Hash32,
		returnedValueCount: 'number.integer >= 0',
		error: 'string > 0',
	}).onUndeclaredKey('reject')
)

export type ActionDispatchEvidence = typeof dispatchEvidence.infer
