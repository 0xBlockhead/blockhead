import { access } from 'node:fs/promises'
import { isAbsolute } from 'node:path'

import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak256 } from '@tevm/voltaire/Hash'
import { isJsonObject, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'
import {
	startHardwareWalletEmulator,
	type HardwareWalletEmulatorSession,
} from '../emulatorProcess.ts'
import {
	createLedgerSpeculosProfile,
	type LedgerSpeculosProfileInput,
} from '../emulatorProfiles.ts'


// Types

export type LedgerDerivationPath = readonly number[]

export type LedgerSpeculosPlan = {
	apduEndpoint: URL
	automationEndpoint: URL
	capabilityEstablished: false
	emulatorProtocolExecuted: false
	evidenceClass: 'configuration-only'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	profile: ReturnType<typeof createLedgerSpeculosProfile>
}

export type LedgerSpeculosApduResponse = {
	data: Uint8Array
	emulatorProtocolExecuted: false
	evidenceClass: 'apdu-response-audit'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	returnedSignatureVerified: false
	statusWord: number
}

export type LedgerEthereumSignatureVerification = {
	evidenceClass: 'cryptographic-signature-verification'
	emulatorExecutionEstablished: false
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	returnedSignatureVerified: true
}

export type LedgerEthereumAddressFixtureVerification = {
	address: `0x${string}`
	emulatorExecutionEstablished: false
	evidenceClass: 'fixture-address-verification'
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	publicKey: Uint8Array
}

export type LedgerSpeculosSession = {
	emulator: HardwareWalletEmulatorSession
	emulatorProtocolExecuted: false
	evidenceClass: 'process-readiness'
	exchange: (command: Uint8Array) => Promise<LedgerSpeculosApduResponse>
	nativeSettlementEvidence: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	readiness: HardwareWalletEmulatorSession['readiness']
	stop: () => Promise<void>
	walletCapabilityEstablished: false
}

export class LedgerSpeculosUnavailableError extends Error {
	readonly capabilityEstablished = false
	readonly phase = 'configuration'

	constructor(message: string, options?: ErrorOptions) {
		super(message, options)
		this.name = 'LedgerSpeculosUnavailableError'
	}
}

export class LedgerSpeculosApduError extends Error {
	readonly capabilityEstablished = false
	readonly phase = 'apdu'
	readonly statusWord?: number

	constructor(message: string, statusWord?: number, options?: ErrorOptions) {
		super(message, options)
		this.name = 'LedgerSpeculosApduError'
		this.statusWord = statusWord
	}
}


// Constants

const hardened = 0x80000000
const maximumPathLength = 10
const maximumShortApduLength = 260


// Functions

const bytesToHex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex')

const ethereumPersonalMessageDigest = (message: Uint8Array) => {
	const prefix = new TextEncoder().encode(`\u0019Ethereum Signed Message:\n${message.byteLength}`)
	return keccak256(Uint8Array.from([...prefix, ...message]))
}

const hexToBytes = (hex: string) => {
	if (!/^(?:[a-fA-F0-9]{2})+$/.test(hex))
		throw new LedgerSpeculosApduError('Speculos returned non-byte-aligned hexadecimal APDU data')

	return Uint8Array.from(Buffer.from(hex, 'hex'))
}

const requireAbsoluteFile = async (label: string, path: string) => {
	if (!isAbsolute(path))
		throw new LedgerSpeculosUnavailableError(`${label} must be an absolute path`)

	try {
		await access(path)
	} catch (cause) {
		throw new LedgerSpeculosUnavailableError(`${label} is unavailable at ${path}`, { cause })
	}
}

export const hardenedLedgerPath = (...indices: readonly number[]): LedgerDerivationPath => {
	if (indices.length === 0 || indices.length > maximumPathLength)
		throw new Error(`Ledger derivation path must contain between 1 and ${maximumPathLength} components`)

	return Object.freeze(indices.map((index) => {
		if (!Number.isInteger(index) || index < 0 || index >= hardened)
			throw new Error('Ledger derivation path components must be unsigned 31-bit integers')

		return index + hardened
	}))
}

export const encodeEthereumGetAddressApdu = ({
	display,
	path,
}: {
	display: boolean
	path: LedgerDerivationPath
}) => {
	if (path.length === 0 || path.length > maximumPathLength)
		throw new Error(`Ledger derivation path must contain between 1 and ${maximumPathLength} components`)

	if (path.some((component) => !Number.isInteger(component) || component < 0 || component > 0xffffffff))
		throw new Error('Encoded Ledger derivation path components must be unsigned 32-bit integers')

	const data = Buffer.alloc(1 + path.length * 4)
	data.writeUInt8(path.length, 0)
	path.forEach((component, index) => data.writeUInt32BE(component, 1 + index * 4))

	return Uint8Array.from([
		0xe0,
		0x02,
		display ? 0x01 : 0x00,
		0x00,
		data.length,
		...data,
	])
}

export const createLedgerSpeculosPlan = (
	input: LedgerSpeculosProfileInput
): LedgerSpeculosPlan => ({
	apduEndpoint: new URL(`http://127.0.0.1:${input.apiPort}/apdu`),
	automationEndpoint: new URL(`http://127.0.0.1:${input.apiPort}/button`),
	capabilityEstablished: false,
	emulatorProtocolExecuted: false,
	evidenceClass: 'configuration-only',
	nativeSettlementEvidence: false,
	physicalHardwareEvidence: false,
	productionModelExecutionEstablished: false,
	profile: createLedgerSpeculosProfile(input),
})

export const exchangeLedgerSpeculosApdu = async ({
	command,
	endpoint,
	fetchImplementation = fetch,
}: {
	command: Uint8Array
	endpoint: URL
	fetchImplementation?: typeof fetch
}): Promise<LedgerSpeculosApduResponse> => {
	if (command.byteLength < 5 || command.byteLength > maximumShortApduLength)
		throw new LedgerSpeculosApduError(
			`Speculos APDU command must be a complete short APDU between 5 and ${maximumShortApduLength} bytes`
		)

	let response: Response

	try {
		response = await fetchImplementation(endpoint, {
			body: JSON.stringify({ data: bytesToHex(command) }),
			headers: { 'content-type': 'application/json' },
			method: 'POST',
		})
	} catch (cause) {
		throw new LedgerSpeculosApduError('Speculos APDU transport failed', undefined, { cause })
	}

	if (!response.ok)
		throw new LedgerSpeculosApduError(`Speculos APDU endpoint returned HTTP ${response.status}`)

	let payload: JsonValue

	try {
		payload = await response.json<JsonValue>()
	} catch (cause) {
		throw new LedgerSpeculosApduError('Speculos APDU endpoint returned invalid JSON', undefined, { cause })
	}

	if (!isJsonObject(payload) || !isJsonString(payload.data))
		throw new LedgerSpeculosApduError('Speculos APDU response omitted hexadecimal data')

	const bytes = hexToBytes(payload.data)

	if (bytes.length < 2)
		throw new LedgerSpeculosApduError('Speculos APDU response omitted its status word')

	const statusWord = bytes[bytes.length - 2] * 256 + bytes[bytes.length - 1]

	if (statusWord !== 0x9000)
		throw new LedgerSpeculosApduError(
			`Ledger application refused the APDU with status word 0x${statusWord.toString(16).padStart(4, '0')}`,
			statusWord
		)

	return {
		data: bytes.slice(0, -2),
		emulatorProtocolExecuted: false,
		evidenceClass: 'apdu-response-audit',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		returnedSignatureVerified: false,
		statusWord,
	}
}

export const verifyLedgerEthereumPersonalMessageSignature = ({
	expectedPublicKey,
	message,
	responseData,
}: {
	expectedPublicKey: Uint8Array
	message: Uint8Array
	responseData: Uint8Array
}): LedgerEthereumSignatureVerification => {
	if (responseData.byteLength !== 65)
		throw new LedgerSpeculosApduError('Ledger Ethereum signature response must contain v, r, and s')

	const rawRecovery = responseData[0]
	const recovery = rawRecovery >= 27 ? rawRecovery - 27 : rawRecovery
	if (recovery !== 0 && recovery !== 1)
		throw new LedgerSpeculosApduError('Ledger Ethereum signature response has an invalid recovery identifier')

	const digest = ethereumPersonalMessageDigest(message)
	const compactSignature = responseData.slice(1)
	if (!secp256k1.verify(compactSignature, digest, expectedPublicKey, { prehash: false }))
		throw new LedgerSpeculosApduError('Ledger Ethereum signature does not verify for the expected public key')

	const recoveredPublicKey = secp256k1.recoverPublicKey(
		Uint8Array.from([recovery, ...compactSignature]),
		digest,
		{ prehash: false }
	)
	const expectedCompressedPublicKey = secp256k1.Point.fromBytes(expectedPublicKey).toBytes(true)
	if (!Buffer.from(recoveredPublicKey).equals(Buffer.from(expectedCompressedPublicKey)))
		throw new LedgerSpeculosApduError('Ledger Ethereum signature recovered a different public key')

	return {
		evidenceClass: 'cryptographic-signature-verification',
		emulatorExecutionEstablished: false,
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		returnedSignatureVerified: true,
	}
}

/**
 * Audits the Ledger Ethereum GET ADDRESS response layout and the address derived
 * from its returned key without claiming that Speculos or hardware produced it.
 */
export const verifyLedgerEthereumAddressFixture = (
	responseData: Uint8Array
): LedgerEthereumAddressFixtureVerification => {
	const publicKeyLength = responseData[0]
	if (publicKeyLength !== 65 || responseData.byteLength < 1 + publicKeyLength + 1)
		throw new LedgerSpeculosApduError('Ledger Ethereum address response omitted its uncompressed public key')

	const publicKey = responseData.slice(1, 1 + publicKeyLength)
	if (publicKey[0] !== 0x04)
		throw new LedgerSpeculosApduError('Ledger Ethereum address response public key is not uncompressed SEC1')
	try {
		secp256k1.Point.fromBytes(publicKey)
	} catch {
		throw new LedgerSpeculosApduError('Ledger Ethereum address response public key has invalid secp256k1 coordinates')
	}
	const addressLength = responseData[1 + publicKeyLength]
	const addressStart = 1 + publicKeyLength + 1
	if (addressLength !== 40 || responseData.byteLength !== addressStart + addressLength)
		throw new LedgerSpeculosApduError('Ledger Ethereum address response must contain one 40-character address')

	const addressText = new TextDecoder().decode(responseData.slice(addressStart))
	if (!/^[a-fA-F0-9]{40}$/.test(addressText))
		throw new LedgerSpeculosApduError('Ledger Ethereum address response contains non-hexadecimal address text')
	const derivedAddress = Buffer.from(keccak256(publicKey.slice(1)).slice(-20)).toString('hex')
	if (addressText.toLowerCase() !== derivedAddress)
		throw new LedgerSpeculosApduError('Ledger Ethereum address response does not match its public key')

	return {
		address: `0x${addressText}`,
		emulatorExecutionEstablished: false,
		evidenceClass: 'fixture-address-verification',
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		publicKey,
	}
}

export const startLedgerSpeculos = async (
	plan: LedgerSpeculosPlan
): Promise<LedgerSpeculosSession> => {
	await requireAbsoluteFile('Speculos executable', plan.profile.command.executable)
	await requireAbsoluteFile('Ledger application ELF', plan.profile.command.args[0])

	const emulator = await startHardwareWalletEmulator(plan.profile)

	return {
		emulator,
		emulatorProtocolExecuted: false,
		evidenceClass: emulator.evidenceClass,
		exchange: (command) => exchangeLedgerSpeculosApdu({
			command,
			endpoint: plan.apduEndpoint,
		}),
		nativeSettlementEvidence: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		readiness: emulator.readiness,
		stop: emulator.stop,
		walletCapabilityEstablished: false,
	}
}
