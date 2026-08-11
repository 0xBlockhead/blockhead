import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CircleCctpBurnFeeRow,
	CircleCctpMessageV2,
	CircleCctpMessagesV2Response,
} from '$/sources/CircleCctp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type CctpMessageId = EntitySelector<typeof schema, EntityType.CctpMessage>
type CctpDomainSupportId = EntitySelector<typeof schema, EntityType.CctpDomainSupport>
type CctpAllowanceId = EntitySelector<typeof schema, EntityType.CctpAllowance>

const cctpFastBurnAllowanceToken = 'USDC'

const assertIrisSource = (
	source: string,
	label: string
) => {
	if (source !== Source.CircleCctpIris)
		throw new Error(`CircleCctpIris_Rest: unsupported ${label} source ${source}`)
}

const assertFastBurnAllowance = (
	allowance: CctpAllowanceId
) => {
	if (allowance.token !== cctpFastBurnAllowanceToken)
		throw new Error(`CircleCctpIris_Rest: unsupported fast burn allowance token ${allowance.token}`)
}

const fastBurnAllowanceTimestampMs = (
	lastUpdated: string
) => {
	if (lastUpdated === '')
		throw new Error('CircleCctpIris_Rest: fast burn allowance missing lastUpdated')

	const timestampMs = Date.parse(lastUpdated)
	if (!Number.isFinite(timestampMs))
		throw new Error(`CircleCctpIris_Rest: invalid lastUpdated ${lastUpdated}`)

	return timestampMs
}

const assertDomainSelector = (
	domain: CctpDomainSupportId,
	label: string,
	irisCctpVersion: number
) => {
	if (!Number.isSafeInteger(domain.domainId) || domain.domainId < 0)
		throw new Error(`CircleCctpIris_Rest: invalid ${label} domain id`)
	if (domain.cctpVersion !== irisCctpVersion)
		throw new Error(`CircleCctpIris_Rest: unsupported ${label} cctpVersion ${domain.cctpVersion}`)
}

const optionalNumberFromWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	const parsed = Number(value)
	if (!Number.isSafeInteger(parsed))
		throw new Error(`CircleCctpIris_Rest: invalid integer wire value ${value}`)

	return parsed
}

const optionalBigIntFromWire = (
	value: string | number | undefined
) => {
	if (value == null || value === '')
		return undefined

	const text = String(value)
	if (!/^(0|[1-9]\d*)$/.test(text))
		throw new Error(`CircleCctpIris_Rest: invalid bigint wire value ${text}`)

	return BigInt(text)
}

const optionalZeroExHex = (
	value: string | null | undefined
) => {
	if (value == null || value === '' || value === 'PENDING')
		return undefined

	const hex = with0xHex(value)
	return (
		/^0x[0-9a-f]*$/.test(hex) ?
			hex
		:
			undefined
	)
}

const domainRef = (
	domainId: number,
	cctpVersion: number
) => ({
	[EntityMetaKey.Selector]: {
		cctpVersion,
		domainId,
	},
})

const messageMatchingNonce = (
	result: CircleCctpMessagesV2Response,
	messageId: CctpMessageId
) => {
	const messages = result.messages.filter((candidate) => (
		candidate.decodedMessage?.sourceDomain === String(messageId.sourceDomain)
		&& candidate.decodedMessage.nonce === messageId.nonce
	))
	if (messages.length !== 1)
		throw new Error(`CircleCctpIris_Rest: expected one decoded message for ${messageId.sourceDomain}:${messageId.nonce}`)

	return messages[0]
}

const messageHashFromBytes = (
	messageBytes: string | undefined
) => {
	if (messageBytes == null || messageBytes === '' || messageBytes === '0x')
		return undefined

	return toHex(keccak256(toBytes(messageBytes)))
}

const cctpMessageSnapshot = (
	messageId: CctpMessageId,
	result: CircleCctpMessagesV2Response,
	message: CircleCctpMessageV2,
	observedAtMs: number,
	irisCctpVersion: number,
	requestId?: string
) => {
	const decoded = message.decodedMessage
	const body = decoded?.decodedMessageBody
	const destinationDomain = optionalNumberFromWire(decoded?.destinationDomain)
	const sourceDomainFromWire = optionalNumberFromWire(decoded?.sourceDomain)
	const messageBytes = optionalZeroExHex(message.message)
	const messageHash = messageHashFromBytes(messageBytes)
	const attestation = optionalZeroExHex(message.attestation)
	const hookData = optionalZeroExHex(body?.hookData)
	const amount = optionalBigIntFromWire(body?.amount)
	const maxFee = optionalBigIntFromWire(body?.maxFee)
	const feeExecuted = optionalBigIntFromWire(body?.feeExecuted)
	const expirationBlock = optionalBigIntFromWire(body?.expirationBlock)
	const minFinalityThreshold = optionalNumberFromWire(decoded?.minFinalityThreshold)
	const finalityThresholdExecuted = optionalNumberFromWire(decoded?.finalityThresholdExecuted)
	const forwardTxHash = (
		message.forwardTxHash == null ?
			undefined
		:
			hexLowerOfByteSize(with0xHex(message.forwardTxHash), 32)
	)
	const sourceTransactionHash = hexLowerOfByteSize(with0xHex(result.sourceTxHash), 32)
	const domainCctpVersion = message.cctpVersion ?? irisCctpVersion

	return {
		sourceDomain: messageId.sourceDomain,
		nonce: messageId.nonce,
		...(message.cctpVersion != null && {
			cctpVersion: message.cctpVersion,
		}),
		...(messageHash != null && {
			messageHash,
		}),
		...(messageBytes != null && {
			messageBytes,
		}),
		...(sourceTransactionHash != null && {
			sourceTransactionHash,
		}),
		$sourceDomain: domainRef(sourceDomainFromWire ?? messageId.sourceDomain, domainCctpVersion),
		...(destinationDomain != null && {
			destinationDomain,
			$destinationDomain: domainRef(destinationDomain, domainCctpVersion),
		}),
		...(decoded?.sender != null && decoded.sender !== '' && {
			sender: decoded.sender,
		}),
		...(decoded?.recipient != null && decoded.recipient !== '' && {
			recipient: decoded.recipient,
		}),
		...(decoded?.destinationCaller != null && decoded.destinationCaller !== '' && {
			destinationCaller: decoded.destinationCaller,
		}),
		...(body?.burnToken != null && body.burnToken !== '' && {
			burnToken: body.burnToken,
		}),
		...(body?.mintRecipient != null && body.mintRecipient !== '' && {
			mintRecipient: body.mintRecipient,
		}),
		...(amount != null && {
			amount,
		}),
		...(body?.messageSender != null && body.messageSender !== '' && {
			messageSender: body.messageSender,
		}),
		...(maxFee != null && {
			maxFee,
		}),
		...(feeExecuted != null && {
			feeExecuted,
		}),
		...(expirationBlock != null && {
			expirationBlock,
		}),
		...(hookData != null && {
			hookData,
		}),
		...(minFinalityThreshold != null && {
			minFinalityThreshold,
		}),
		...(finalityThresholdExecuted != null && {
			finalityThresholdExecuted,
		}),
		$$attestationTimestamps: [{
			[EntityMetaKey.Selector]: {
				$message: messageId,
				timestampMs: observedAtMs,
				source: Source.CircleCctpIris,
			},
		}],
		attestationObservation: {
			$message: {
				[EntityMetaKey.Selector]: messageId,
			},
			timestampMs: observedAtMs,
			source: Source.CircleCctpIris,
			...(message.status != null && {
				status: message.status,
			}),
			...(attestation != null && {
				attestation,
			}),
			...(message.delayReason != null && {
				delayReason: message.delayReason,
			}),
			...(message.forwardState != null && message.forwardState !== '' && {
				forwardState: message.forwardState,
			}),
			...(forwardTxHash != null && {
				forwardTxHash,
			}),
			...(requestId != null && {
				requestId,
			}),
		},
	}
}

const loadMessageForSelector = async (
	messageId: CctpMessageId
) => {
	const { getMessages } = await import('$/sources/CircleCctp/Rest/queries.ts')
	const loaded = await getMessages({
		sourceDomain: messageId.sourceDomain,
		subject: {
			nonce: messageId.nonce,
		},
	})
	if (loaded == null)
		throw new Error(`CircleCctpIris_Rest: message not found for ${messageId.sourceDomain}:${messageId.nonce}`)

	return {
		result: loaded.body,
		requestId: loaded.requestId,
		message: messageMatchingNonce(loaded.body, messageId),
	}
}

const burnFeeRowsFromWire = (
	rows: CircleCctpBurnFeeRow[]
) => (
	rows.map((row) => {
		const forwardFeeLow = optionalBigIntFromWire(row.forwardFee?.low)
		const forwardFeeMedium = optionalBigIntFromWire(row.forwardFee?.medium)
		const forwardFeeHigh = optionalBigIntFromWire(row.forwardFee?.high)
		return {
			finalityThreshold: row.finalityThreshold,
			minimumFeeBps: row.minimumFee,
			...(forwardFeeLow != null && {
				forwardFeeLow,
			}),
			...(forwardFeeMedium != null && {
				forwardFeeMedium,
			}),
			...(forwardFeeHigh != null && {
				forwardFeeHigh,
			}),
		}
	})
)

export default {
	source: Source.CircleCctpIris,

	resolvers: [
		defineResolver({
			entityType: EntityType.CctpAllowance,
			resolve: {
				Token: {
					resolve: async (allowanceId) => {
						assertFastBurnAllowance(allowanceId)
						const { getFastBurnUsdcAllowance } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const allowance = await getFastBurnUsdcAllowance()

						return {
							token: cctpFastBurnAllowanceToken,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$allowance: allowanceId,
									timestampMs: fastBurnAllowanceTimestampMs(allowance.body.lastUpdated),
									source: Source.CircleCctpIris,
								},
								allowanceUsdc: allowance.body.allowance,
								...(allowance.requestId != null && {
									requestId: allowance.requestId,
								}),
							}],
						}
					},
				},
			},
		})({
			token: (allowance) => allowance.token,
			$$timestamps: (allowance) => allowance.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CctpMessage,
			resolve: {
				SourceDomainNonce: {
					resolve: async (messageId) => {
						if (!Number.isSafeInteger(messageId.sourceDomain) || messageId.sourceDomain < 0)
							throw new Error('CircleCctpIris_Rest: invalid source domain')
						if (messageId.nonce === '')
							throw new Error('CircleCctpIris_Rest: invalid nonce')

						const {
							result,
							message,
							requestId,
						} = await loadMessageForSelector(messageId)
						const { irisCctpVersion } = await import('$/sources/CircleCctp/Catalog/constants.ts')
						return cctpMessageSnapshot(
							messageId,
							result,
							message,
							Date.now(),
							irisCctpVersion,
							requestId
						)
					},
				},
			},
		})({
			sourceDomain: (message) => message.sourceDomain,
			nonce: (message) => message.nonce,
			cctpVersion: (message) => message.cctpVersion,
			messageHash: (message) => message.messageHash,
			messageBytes: (message) => message.messageBytes,
			sourceTransactionHash: (message) => message.sourceTransactionHash,
			$sourceDomain: (message) => message.$sourceDomain,
			$destinationDomain: (message) => message.$destinationDomain,
			destinationDomain: (message) => message.destinationDomain,
			sender: (message) => message.sender,
			recipient: (message) => message.recipient,
			destinationCaller: (message) => message.destinationCaller,
			burnToken: (message) => message.burnToken,
			mintRecipient: (message) => message.mintRecipient,
			amount: (message) => message.amount,
			messageSender: (message) => message.messageSender,
			maxFee: (message) => message.maxFee,
			feeExecuted: (message) => message.feeExecuted,
			expirationBlock: (message) => message.expirationBlock,
			hookData: (message) => message.hookData,
			minFinalityThreshold: (message) => message.minFinalityThreshold,
			finalityThresholdExecuted: (message) => message.finalityThresholdExecuted,
			$$attestationTimestamps: (message) => message.$$attestationTimestamps,
		}),

		defineResolver({
			entityType: EntityType.CctpAttestation_Timestamp,
			resolve: {
				MessageTimestampMsSource: {
					resolve: async ({
						$message,
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'attestation')
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris_Rest: invalid attestation timestamp')

						const {
							result,
							message,
						} = await loadMessageForSelector($message)
						const { irisCctpVersion } = await import('$/sources/CircleCctp/Catalog/constants.ts')
						const snapshot = cctpMessageSnapshot(
							$message,
							result,
							message,
							timestampMs,
							irisCctpVersion
						)
						if (snapshot.messageHash == null)
							throw new Error('CircleCctpIris_Rest: message bytes required for attestation lookup')

						const { getAttestation } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const attestation = await getAttestation({
							messageHash: snapshot.messageHash,
						})
						const attestationBytes = optionalZeroExHex(attestation.body.attestation)
						const messageObservation = snapshot.attestationObservation
						return {
							$message: messageObservation.$message,
							timestampMs: messageObservation.timestampMs,
							source: messageObservation.source,
							status: attestation.body.status,
							...(attestationBytes != null && {
								attestation: attestationBytes,
							}),
							...(messageObservation.delayReason != null && {
								delayReason: messageObservation.delayReason,
							}),
							...(messageObservation.forwardState != null && {
								forwardState: messageObservation.forwardState,
							}),
							...(messageObservation.forwardTxHash != null && {
								forwardTxHash: messageObservation.forwardTxHash,
							}),
							...(attestation.requestId != null && {
								requestId: attestation.requestId,
							}),
						}
					},
				},
			},
		})({
			$message: (observation) => observation.$message,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			attestation: (observation) => observation.attestation,
			delayReason: (observation) => observation.delayReason,
			forwardState: (observation) => observation.forwardState,
			forwardTxHash: (observation) => observation.forwardTxHash,
			requestId: (observation) => observation.requestId,
		}),

		defineResolver({
			entityType: EntityType.CctpBurnFee_Timestamp,
			resolve: {
				SourceDomainDestinationDomainTimestampMsSource: {
					resolve: async ({
						$sourceDomain,
						$destinationDomain,
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'burn fee')
						const { irisCctpVersion } = await import('$/sources/CircleCctp/Catalog/constants.ts')
						assertDomainSelector($sourceDomain, 'source', irisCctpVersion)
						assertDomainSelector($destinationDomain, 'destination', irisCctpVersion)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris_Rest: invalid burn fee timestamp')

						const { getBurnUsdcFees } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const fees = await getBurnUsdcFees({
							sourceDomain: $sourceDomain.domainId,
							destinationDomain: $destinationDomain.domainId,
							forward: true,
							hyperCoreDeposit: false,
						})

						return {
							$sourceDomain: {
								[EntityMetaKey.Selector]: $sourceDomain,
							},
							$destinationDomain: {
								[EntityMetaKey.Selector]: $destinationDomain,
							},
							timestampMs,
							source,
							forward: true,
							hyperCoreDeposit: false,
							feeRows: burnFeeRowsFromWire(fees.body),
						}
					},
				},
			},
		})({
			$sourceDomain: (observation) => observation.$sourceDomain,
			$destinationDomain: (observation) => observation.$destinationDomain,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			forward: (observation) => observation.forward,
			hyperCoreDeposit: (observation) => observation.hyperCoreDeposit,
			feeRows: (observation) => observation.feeRows,
		}),

		defineResolver({
			entityType: EntityType.CctpFastBurnAllowance_Timestamp,
			resolve: {
				AllowanceTimestampMsSource: {
					resolve: async ({
						$allowance,
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'fast burn allowance')
						assertFastBurnAllowance($allowance)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris_Rest: invalid fast burn allowance timestamp')

						const { getFastBurnUsdcAllowance } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const allowance = await getFastBurnUsdcAllowance()
						if (fastBurnAllowanceTimestampMs(allowance.body.lastUpdated) !== timestampMs)
							throw new Error('CircleCctpIris_Rest: observation timestampMs does not match Iris allowance clock')

						return {
							$allowance: {
								[EntityMetaKey.Selector]: $allowance,
							},
							timestampMs,
							source: Source.CircleCctpIris,
							allowanceUsdc: allowance.body.allowance,
							...(allowance.requestId != null && {
								requestId: allowance.requestId,
							}),
						}
					},
				},
			},
		})({
			$allowance: (observation) => observation.$allowance,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			allowanceUsdc: (observation) => observation.allowanceUsdc,
			requestId: (observation) => observation.requestId,
		}),
	],
} satisfies RegisteredSourceResolverModule
