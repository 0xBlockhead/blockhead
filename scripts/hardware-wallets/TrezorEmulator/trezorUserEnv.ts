import { access } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { isAbsolute } from 'node:path'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import * as TxEnvelopeEip1559 from 'ox/TxEnvelopeEip1559'

import {
	startHardwareWalletEmulator,
	type HardwareWalletEmulatorSession,
} from '../emulatorProcess.ts'
import {
	createTrezorUserEnvProfile,
	type TrezorUserEnvProfileInput,
} from '../emulatorProfiles.ts'


// Types

export type TrezorEmulatorModel = 'T1B1' | 'T2T1' | 'T3B1' | 'T3T1' | 'T3W1'

export type TrezorUserEnvControllerRequest = Readonly<{
	id: number
	model: TrezorEmulatorModel
	output_to_logfile: true
	save_screenshots: false
	type: 'emulator-start'
	version: string
	wipe: true
}>

export type TrezorEthereumSignTransactionRequest = Readonly<{
	method: 'ethereumSignTransaction'
	params: Readonly<{
		path: "m/44'/60'/0'/0/0"
		transaction: Readonly<{
			chainId: number
			data: `0x${string}`
			gasLimit: `0x${string}`
			maxFeePerGas: `0x${string}`
			maxPriorityFeePerGas: `0x${string}`
			nonce: `0x${string}`
			to: `0x${string}`
			value: `0x${string}`
		}>
	}>
}>

export type TrezorUserEnvPlan = Readonly<{
	capabilityEstablished: false
	controllerEndpoint: URL
	controllerRequest: TrezorUserEnvControllerRequest
	cryptographicSignatureVerified: false
	emulatorProtocolExecuted: false
	evidenceClass: 'configuration-only'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	profile: ReturnType<typeof createTrezorUserEnvProfile>
	responseAuditAvailable: false
	signingRequest: TrezorEthereumSignTransactionRequest
}>

export type TrezorUserEnvSession = Readonly<{
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
}>

export type TrezorFixtureTransactionSignatureVerification = Readonly<{
	cryptographicSignatureVerified: true
	emulatorProtocolExecuted: false
	evidenceClass: 'fixture-signature-verification'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	walletCapabilityEstablished: false
}>

export type TrezorEthereumSignTransactionResponse = Readonly<{
	payload: Readonly<{
		r: `0x${string}`
		s: `0x${string}`
		v: `0x${string}`
	}>
	success: true
}>

export class TrezorUserEnvUnavailableError extends Error {
	readonly capabilityEstablished = false
	readonly phase = 'configuration'

	constructor(message: string, options?: ErrorOptions) {
		super(message, options)
		this.name = 'TrezorUserEnvUnavailableError'
	}
}


// Functions

const requireAbsoluteExecutable = async (path: string) => {
	if (!isAbsolute(path))
		throw new TrezorUserEnvUnavailableError('Docker executable must be an absolute path')

	try {
		await access(path)
	} catch (cause) {
		throw new TrezorUserEnvUnavailableError(
			`Docker executable is unavailable at ${path}`,
			{ cause }
		)
	}
}

const requireHexQuantity = (label: string, value: `0x${string}`) => {
	if (!/^0x(?:0|[1-9a-fA-F][a-fA-F0-9]*)$/.test(value))
		throw new Error(`${label} must be a canonical hexadecimal quantity`)
}

const requireHexData = (label: string, value: `0x${string}`) => {
	if (!/^0x(?:[a-fA-F0-9]{2})*$/.test(value))
		throw new Error(`${label} must be byte-aligned hexadecimal data`)
}

export const createTrezorUserEnvPlan = ({
	controllerRequestId,
	firmwareVersion,
	model,
	profile,
	transaction,
}: {
	controllerRequestId: number
	firmwareVersion: string
	model: TrezorEmulatorModel
	profile: TrezorUserEnvProfileInput
	transaction: TrezorEthereumSignTransactionRequest['params']['transaction']
}): TrezorUserEnvPlan => {
	if (!Number.isSafeInteger(controllerRequestId) || controllerRequestId < 0)
		throw new Error('Trezor User Env controller request id must be a non-negative safe integer')
	if (!/^\d+\.\d+\.\d+$/.test(firmwareVersion))
		throw new Error('Trezor User Env firmware version must be a pinned numeric X.Y.Z version')
	if (!Number.isSafeInteger(transaction.chainId) || transaction.chainId <= 0)
		throw new Error('Trezor transaction chain id must be a positive safe integer')
	if (!/^0x[a-fA-F0-9]{40}$/.test(transaction.to))
		throw new Error('Trezor transaction recipient must be a 20-byte hexadecimal address')

	requireHexQuantity('Trezor transaction value', transaction.value)
	requireHexQuantity('Trezor transaction nonce', transaction.nonce)
	requireHexQuantity('Trezor transaction gas limit', transaction.gasLimit)
	requireHexQuantity('Trezor transaction maximum fee', transaction.maxFeePerGas)
	requireHexQuantity(
		'Trezor transaction maximum priority fee',
		transaction.maxPriorityFeePerGas
	)
	if (BigInt(transaction.maxPriorityFeePerGas) > BigInt(transaction.maxFeePerGas))
		throw new Error('Trezor transaction maximum priority fee must not exceed its maximum fee')
	requireHexData('Trezor transaction calldata', transaction.data)

	return Object.freeze({
		capabilityEstablished: false,
		controllerEndpoint: new URL(`ws://127.0.0.1:${profile.controllerPort}`),
		controllerRequest: Object.freeze({
			id: controllerRequestId,
			model,
			output_to_logfile: true,
			save_screenshots: false,
			type: 'emulator-start',
			version: firmwareVersion,
			wipe: true,
		}),
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'configuration-only',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		profile: createTrezorUserEnvProfile(profile),
		responseAuditAvailable: false,
		signingRequest: Object.freeze({
			method: 'ethereumSignTransaction',
			params: Object.freeze({
				path: "m/44'/60'/0'/0/0",
				transaction: Object.freeze(transaction),
			}),
		}),
	})
}

export const startTrezorUserEnv = async (
	plan: TrezorUserEnvPlan
): Promise<TrezorUserEnvSession> => {
	await requireAbsoluteExecutable(plan.profile.command.executable)
	const emulator = await startHardwareWalletEmulator(plan.profile)

	return Object.freeze({
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
	})
}

/**
 * Audits a source-shaped Trezor Connect fixture response against the exact
 * EIP-1559 request without claiming that an emulator or device produced it.
 */
export const verifyTrezorFixtureTransactionSignature = ({
	expectedPublicKey,
	request,
	response,
}: {
	expectedPublicKey: Uint8Array
	request: TrezorEthereumSignTransactionRequest
	response: TrezorEthereumSignTransactionResponse
}): TrezorFixtureTransactionSignatureVerification => {
	const { transaction } = request.params
	const digest = Hex.toBytes(TxEnvelopeEip1559.getSignPayload(TxEnvelopeEip1559.from({
		chainId: transaction.chainId,
		data: transaction.data,
		gas: BigInt(transaction.gasLimit),
		maxFeePerGas: BigInt(transaction.maxFeePerGas),
		maxPriorityFeePerGas: BigInt(transaction.maxPriorityFeePerGas),
		nonce: BigInt(transaction.nonce),
		to: transaction.to,
		value: BigInt(transaction.value),
	})))
	const r = Hex.toBytes(response.payload.r)
	const s = Hex.toBytes(response.payload.s)
	if (r.byteLength !== 32 || s.byteLength !== 32)
		throw new Error('Trezor EIP-1559 response must contain 32-byte r and s values')

	const v = BigInt(response.payload.v)
	const recovery = v === 0n || v === 1n ? Number(v)
		: v === 27n || v === 28n ? Number(v - 27n)
		: undefined
	if (recovery === undefined)
		throw new Error('Trezor EIP-1559 response has an invalid recovery value')

	const compactSignature = Uint8Array.from([...r, ...s])
	if (!secp256k1.verify(compactSignature, digest, expectedPublicKey, { prehash: false }))
		throw new Error('Trezor fixture signature does not verify for the requested transaction and public key')
	const recoveredPublicKey = secp256k1.recoverPublicKey(
		Uint8Array.from([recovery, ...compactSignature]),
		digest,
		{ prehash: false }
	)
	const expectedCompressedPublicKey = secp256k1.Point.fromBytes(expectedPublicKey).toBytes(true)
	if (!Buffer.from(recoveredPublicKey).equals(Buffer.from(expectedCompressedPublicKey)))
		throw new Error('Trezor fixture signature recovered a different public key')

	return Object.freeze({
		cryptographicSignatureVerified: true,
		emulatorProtocolExecuted: false,
		evidenceClass: 'fixture-signature-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		walletCapabilityEstablished: false,
	})
}
