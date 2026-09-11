import { access } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { dirname, isAbsolute } from 'node:path'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import * as Hash from 'ox/Hash'

import {
	startHardwareWalletEmulator,
	type HardwareWalletEmulatorConfiguration,
	type HardwareWalletEmulatorSession,
} from '../emulatorProcess.ts'
import {
	createBitBox02SimulatorProfile,
	type BitBox02SimulatorProfileInput,
} from '../emulatorProfiles.ts'


// Types

type EthereumTransactionBytes = {
	data: Uint8Array
	gasLimit: Uint8Array
	nonce: Uint8Array
	recipient: Uint8Array
	value: Uint8Array
}

export type BitBox02LegacyTransaction = EthereumTransactionBytes & {
	gasPrice: Uint8Array
}

export type BitBox02Eip1559Transaction = EthereumTransactionBytes & {
	chainId: bigint
	maxFeePerGas: Uint8Array
	maxPriorityFeePerGas: Uint8Array
}

export type BitBox02SigningRequest =
	| {
		arguments: readonly [
			chainId: bigint,
			keypath: string,
			transaction: BitBox02LegacyTransaction,
		]
		method: 'ethSignTransaction'
	}
	| {
		arguments: readonly [
			keypath: string,
			transaction: BitBox02Eip1559Transaction,
		]
		method: 'ethSign1559Transaction'
	}
	| {
		arguments: readonly [
			chainId: bigint,
			keypath: string,
			message: Uint8Array,
		]
		method: 'ethSignMessage'
	}

export type BitBox02SimulatorPlan = {
	capabilityEstablished: false
	cryptographicSignatureVerified: false
	emulatorProtocolExecuted: false
	evidenceClass: 'configuration-only'
	fakeMemoryFilePath: string
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	profile: HardwareWalletEmulatorConfiguration
	responseAuditAvailable: false
	signingRequestEvidence: 'request-construction-only'
}

export type BitBox02SimulatorSession = {
	cryptographicSignatureVerified: false
	emulator: HardwareWalletEmulatorSession
	emulatorProtocolExecuted: false
	evidenceClass: 'process-readiness'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	readiness: HardwareWalletEmulatorSession['readiness']
	responseAuditAvailable: false
	stop: () => Promise<void>
	walletCapabilityEstablished: false
}

export type BitBox02EthereumSignatureResponse = Readonly<{
	r: Uint8Array
	s: Uint8Array
	v: Uint8Array
}>

export type BitBox02FixtureSignatureVerification = Readonly<{
	cryptographicSignatureVerified: true
	emulatorProtocolExecuted: false
	evidenceClass: 'fixture-signature-verification'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
}>

export class BitBox02SimulatorUnavailableError extends Error {
	readonly capabilityEstablished = false
	readonly phase = 'configuration'

	constructor(message: string, options?: ErrorOptions) {
		super(message, options)
		this.name = 'BitBox02SimulatorUnavailableError'
	}
}

export type BitBox02SimulatorPlanInput = BitBox02SimulatorProfileInput & {
	fakeMemoryFilePath: string
}


// Constants

const maximumUint256Bytes = 32


// Functions

const copyBytes = (value: Uint8Array) => Uint8Array.from(value)

const requireAbsolutePath = (label: string, path: string) => {
	if (!isAbsolute(path))
		throw new BitBox02SimulatorUnavailableError(`${label} must be an absolute path`)
}

const requireAvailablePath = async (label: string, path: string) => {
	requireAbsolutePath(label, path)

	try {
		await access(path)
	} catch (cause) {
		throw new BitBox02SimulatorUnavailableError(`${label} is unavailable at ${path}`, { cause })
	}
}

const requireChainId = (chainId: bigint) => {
	if (chainId <= 0n)
		throw new Error('BitBox02 Ethereum chain ID must be positive')
}

const requireEthereumKeypath = (keypath: string) => {
	if (!/^m\/44'\/(?:60|1)'\/[0-9]+'\/0\/[0-9]+$/.test(keypath))
		throw new Error('BitBox02 Ethereum signing keypath must be a complete BIP-44 account path')
}

const requireTransactionBytes = ({
	data,
	gasLimit,
	nonce,
	recipient,
	value,
}: EthereumTransactionBytes) => {
	for (const [label, bytes] of [
		['nonce', nonce],
		['gas limit', gasLimit],
		['value', value],
	] as const) {
		if (bytes.length > maximumUint256Bytes)
			throw new Error(`BitBox02 transaction ${label} exceeds 256 bits`)
	}

	if (recipient.length !== 0 && recipient.length !== 20)
		throw new Error('BitBox02 transaction recipient must be empty or exactly 20 bytes')

	if (data.length > 65_535)
		throw new Error('BitBox02 transaction data exceeds the bounded harness request size')
}

const copyBaseTransaction = (
	transaction: EthereumTransactionBytes
): EthereumTransactionBytes => ({
	data: copyBytes(transaction.data),
	gasLimit: copyBytes(transaction.gasLimit),
	nonce: copyBytes(transaction.nonce),
	recipient: copyBytes(transaction.recipient),
	value: copyBytes(transaction.value),
})

export const createBitBox02SimulatorPlan = ({
	fakeMemoryFilePath,
	...profileInput
}: BitBox02SimulatorPlanInput): BitBox02SimulatorPlan => {
	requireAbsolutePath('BitBox02 fake-memory file', fakeMemoryFilePath)

	const baseProfile = createBitBox02SimulatorProfile(profileInput)
	const profile = {
		...baseProfile,
		command: {
			...baseProfile.command,
			environment: {
				...baseProfile.command.environment,
				FAKE_MEMORY_FILEPATH: fakeMemoryFilePath,
			},
		},
	}

	return Object.freeze({
		capabilityEstablished: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'configuration-only',
		fakeMemoryFilePath,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		profile,
		responseAuditAvailable: false,
		signingRequestEvidence: 'request-construction-only',
	})
}

export const planBitBox02LegacyTransaction = ({
	chainId,
	keypath,
	transaction,
}: {
	chainId: bigint
	keypath: string
	transaction: BitBox02LegacyTransaction
}): BitBox02SigningRequest => {
	requireChainId(chainId)
	requireEthereumKeypath(keypath)
	requireTransactionBytes(transaction)

	if (transaction.gasPrice.length > maximumUint256Bytes)
		throw new Error('BitBox02 transaction gas price exceeds 256 bits')

	return Object.freeze({
		arguments: Object.freeze([
			chainId,
			keypath,
			{
				...copyBaseTransaction(transaction),
				gasPrice: copyBytes(transaction.gasPrice),
			},
		] as const),
		method: 'ethSignTransaction',
	})
}

export const planBitBox02Eip1559Transaction = ({
	keypath,
	transaction,
}: {
	keypath: string
	transaction: BitBox02Eip1559Transaction
}): BitBox02SigningRequest => {
	requireChainId(transaction.chainId)
	requireEthereumKeypath(keypath)
	requireTransactionBytes(transaction)

	if (
		transaction.maxFeePerGas.length > maximumUint256Bytes
		|| transaction.maxPriorityFeePerGas.length > maximumUint256Bytes
	)
		throw new Error('BitBox02 EIP-1559 fee field exceeds 256 bits')

	return Object.freeze({
		arguments: Object.freeze([
			keypath,
			{
				...copyBaseTransaction(transaction),
				chainId: transaction.chainId,
				maxFeePerGas: copyBytes(transaction.maxFeePerGas),
				maxPriorityFeePerGas: copyBytes(transaction.maxPriorityFeePerGas),
			},
		] as const),
		method: 'ethSign1559Transaction',
	})
}

export const planBitBox02Message = ({
	chainId,
	keypath,
	message,
}: {
	chainId: bigint
	keypath: string
	message: Uint8Array
}): BitBox02SigningRequest => {
	requireChainId(chainId)
	requireEthereumKeypath(keypath)

	if (message.length === 0)
		throw new Error('BitBox02 Ethereum message must not be empty')

	return Object.freeze({
		arguments: Object.freeze([
			chainId,
			keypath,
			copyBytes(message),
		] as const),
		method: 'ethSignMessage',
	})
}

export const startBitBox02Simulator = async (
	plan: BitBox02SimulatorPlan
): Promise<BitBox02SimulatorSession> => {
	await requireAvailablePath('BitBox02 simulator executable', plan.profile.command.executable)
	await requireAvailablePath('BitBox02 fake-memory parent directory', dirname(plan.fakeMemoryFilePath))

	const emulator = await startHardwareWalletEmulator(plan.profile)

	return {
		cryptographicSignatureVerified: false,
		emulator,
		emulatorProtocolExecuted: false,
		evidenceClass: emulator.evidenceClass,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		readiness: emulator.readiness,
		responseAuditAvailable: false,
		stop: emulator.stop,
		walletCapabilityEstablished: false,
	}
}

/**
 * Audits the exact r/s/v shape returned by the BitBox02 API for a personal
 * message fixture without claiming simulator transport or device execution.
 */
export const verifyBitBox02FixtureMessageSignature = ({
	expectedPublicKey,
	request,
	response,
}: {
	expectedPublicKey: Uint8Array
	request: BitBox02SigningRequest
	response: BitBox02EthereumSignatureResponse
}): BitBox02FixtureSignatureVerification => {
	if (request.method !== 'ethSignMessage')
		throw new Error('BitBox02 message signature audit requires the exact ethSignMessage request')
	const [chainId, keypath, message] = request.arguments
	requireChainId(chainId)
	requireEthereumKeypath(keypath)
	if (message.byteLength === 0)
		throw new Error('BitBox02 Ethereum message must not be empty')

	if (response.r.byteLength !== 32 || response.s.byteLength !== 32 || response.v.byteLength !== 1)
		throw new Error('BitBox02 Ethereum response must contain 32-byte r/s and one-byte v')

	const rawRecovery = response.v[0]
	const recovery = rawRecovery === 27 || rawRecovery === 28 ? rawRecovery - 27 : rawRecovery
	if (recovery !== 0 && recovery !== 1)
		throw new Error('BitBox02 Ethereum response has an invalid recovery identifier')

	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	const digest = Hash.keccak256(Uint8Array.from([...prefix, ...message]), { as: 'Bytes' })
	const compactSignature = Uint8Array.from([...response.r, ...response.s])
	if (!secp256k1.verify(compactSignature, digest, expectedPublicKey, { prehash: false }))
		throw new Error('BitBox02 fixture signature does not verify for the requested message and public key')

	const recoveredPublicKey = secp256k1.recoverPublicKey(
		Uint8Array.from([recovery, ...compactSignature]),
		digest,
		{ prehash: false }
	)
	const expectedCompressedPublicKey = secp256k1.Point.fromBytes(expectedPublicKey).toBytes(true)
	if (!Buffer.from(recoveredPublicKey).equals(Buffer.from(expectedCompressedPublicKey)))
		throw new Error('BitBox02 fixture signature recovered a different public key')

	return Object.freeze({
		cryptographicSignatureVerified: true,
		emulatorProtocolExecuted: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
	})
}
