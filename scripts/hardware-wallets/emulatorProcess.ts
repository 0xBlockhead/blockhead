import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { access, realpath } from 'node:fs/promises'
import { connect } from 'node:net'
import { isAbsolute } from 'node:path'


// Types

export type HardwareWalletEmulatorKind =
	| 'bitbox02-simulator'
	| 'gridplus-lattice-simulator'
	| 'ledger-speculos'
	| 'trezor-user-env'

export type HardwareWalletProcessReadiness = {
	readonly apduExchangeObserved: false
	readonly cryptographicSignatureVerified: false
	readonly emulatorProtocolExecuted: false
	readonly evidenceClass: 'process-readiness'
	readonly kind: HardwareWalletEmulatorKind
	readonly nativeSettlementEvidence: false
	readonly nativeSigningRequestConstructed: false
	readonly physicalHardwareEvidence: false
	readonly productionModelExecutionEstablished: false
	readonly responseAuditAvailable: false
	readonly walletCapabilityEstablished: false
}

export type HardwareWalletEmulatorCommand = {
	args: readonly string[]
	environment?: Readonly<Record<string, string>>
	executable: string
	workingDirectory: string
}

export type HardwareWalletEmulatorConfiguration = {
	command: HardwareWalletEmulatorCommand
	identity: string
	kind: HardwareWalletEmulatorKind
	readiness: {
		endpoint: URL
		expectedResponse: {
			bodyIncludes: string
			status: number
		}
		intervalMilliseconds: number
		kind?: 'http'
		timeoutMilliseconds: number
	} | {
		host: '127.0.0.1' | 'localhost'
		intervalMilliseconds: number
		kind: 'tcp'
		port: number
		timeoutMilliseconds: number
	}
}

export type HardwareWalletEmulatorSession = {
	apduExchangeObserved: false
	cryptographicSignatureVerified: false
	emulatorProtocolExecuted: false
	evidenceClass: 'process-readiness'
	identity: string
	nativeSettlementEvidence: false
	nativeSigningRequestConstructed: false
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	processId: number
	readiness: HardwareWalletProcessReadiness
	responseAuditAvailable: false
	stop: () => Promise<void>
	walletCapabilityEstablished: false
}

export class HardwareWalletEmulatorStartError extends Error {
	readonly capabilityEstablished = false
	readonly diagnostics: string
	readonly identity: string
	readonly phase: 'process-unavailable' | 'readiness'

	constructor({
		cause,
		diagnostics,
		identity,
		message,
		phase,
	}: {
		cause?: ErrorOptions['cause']
		diagnostics: string
		identity: string
		message: string
		phase: 'process-unavailable' | 'readiness'
	}) {
		super(message, { cause })
		this.name = 'HardwareWalletEmulatorStartError'
		this.diagnostics = diagnostics
		this.identity = identity
		this.phase = phase
	}
}


// Constants

const processReadiness = Object.freeze({
	'bitbox02-simulator': Object.freeze({
		apduExchangeObserved: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'process-readiness',
		kind: 'bitbox02-simulator',
		nativeSettlementEvidence: false,
		nativeSigningRequestConstructed: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		responseAuditAvailable: false,
		walletCapabilityEstablished: false,
	}),
	'gridplus-lattice-simulator': Object.freeze({
		apduExchangeObserved: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'process-readiness',
		kind: 'gridplus-lattice-simulator',
		nativeSettlementEvidence: false,
		nativeSigningRequestConstructed: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		responseAuditAvailable: false,
		walletCapabilityEstablished: false,
	}),
	'ledger-speculos': Object.freeze({
		apduExchangeObserved: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'process-readiness',
		kind: 'ledger-speculos',
		nativeSettlementEvidence: false,
		nativeSigningRequestConstructed: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		responseAuditAvailable: false,
		walletCapabilityEstablished: false,
	}),
	'trezor-user-env': Object.freeze({
		apduExchangeObserved: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'process-readiness',
		kind: 'trezor-user-env',
		nativeSettlementEvidence: false,
		nativeSigningRequestConstructed: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		responseAuditAvailable: false,
		walletCapabilityEstablished: false,
	}),
} as const satisfies Record<HardwareWalletEmulatorKind, HardwareWalletProcessReadiness>)

export const hardwareWalletProcessReadinessEvidence = (
	kind: HardwareWalletEmulatorKind
): HardwareWalletProcessReadiness => processReadiness[kind]

const maximumDiagnosticCharacters = 16_384
const diagnosticHeadCharacters = maximumDiagnosticCharacters / 2


// Functions

const appendDiagnostic = (current: string, chunk: Buffer) => {
	const combined = `${current}${chunk.toString()}`

	if (combined.length <= maximumDiagnosticCharacters)
		return combined

	return `${combined.slice(0, diagnosticHeadCharacters)}\n… diagnostics truncated …\n${combined.slice(-diagnosticHeadCharacters)}`
}

const delay = (milliseconds: number) => new Promise<void>((resolve) => {
	setTimeout(resolve, milliseconds)
})

const validateConfiguration = async ({
	command,
	identity,
	readiness,
}: HardwareWalletEmulatorConfiguration) => {
	if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(identity))
		throw new Error(`Invalid deterministic emulator identity: ${identity}`)

	if (command.executable.includes('/') && !isAbsolute(command.executable))
		throw new Error('Emulator executable must be a PATH command or an absolute path')

	const readinessHost = readiness.kind === 'tcp'
		? readiness.host
		: readiness.endpoint.hostname

	if (readinessHost !== '127.0.0.1' && readinessHost !== 'localhost')
		throw new Error('Emulator readiness endpoint must be loopback-only')

	if (
		readiness.kind !== 'tcp'
		&& readiness.endpoint.protocol !== 'http:'
		&& readiness.endpoint.protocol !== 'https:'
	)
		throw new Error('Emulator readiness endpoint must use HTTP or HTTPS')

	if (readiness.intervalMilliseconds <= 0 || readiness.timeoutMilliseconds <= 0)
		throw new Error('Emulator readiness timing must be positive')

	if (readiness.kind === 'tcp' && (
		!Number.isInteger(readiness.port)
		|| readiness.port < 1_024
		|| readiness.port > 65_535
	))
		throw new Error('Emulator TCP readiness must use an unprivileged port')

	if (readiness.kind !== 'tcp' && (
		readiness.expectedResponse.status < 100
		|| readiness.expectedResponse.status > 599
		|| readiness.expectedResponse.bodyIncludes.length === 0
	))
		throw new Error('Emulator readiness must identify an exact HTTP status and non-empty response marker')

	await access(await realpath(command.workingDirectory))
}

const terminateOwnedProcess = async (child: ChildProcessWithoutNullStreams) => {
	if (child.pid === undefined || child.exitCode !== null || child.signalCode !== null)
		return

	const exited = new Promise<void>((resolve) => {
		child.once('exit', () => resolve())
	})

	child.kill('SIGTERM')
	await Promise.race([
		exited,
		delay(1_000),
	])

	if (child.exitCode === null && child.signalCode === null) {
		child.kill('SIGKILL')
		await exited
	}
}

const waitForReadiness = async ({
	child,
	readProcessError,
	readiness,
}: {
	child: ChildProcessWithoutNullStreams
	readProcessError: () => Error | undefined
	readiness: HardwareWalletEmulatorConfiguration['readiness']
}) => {
	const deadline = Date.now() + readiness.timeoutMilliseconds
	let firstFailure: string | undefined

	while (Date.now() < deadline) {
		const processError = readProcessError()

		if (processError !== undefined)
			throw processError

		if (child.exitCode !== null || child.signalCode !== null)
			throw new Error(`Emulator exited before readiness with code ${child.exitCode ?? child.signalCode}`)

		try {
			if (readiness.kind === 'tcp') {
				await new Promise<void>((resolve, reject) => {
					const socket = connect(readiness.port, readiness.host)
					const timeout = setTimeout(() => {
						socket.destroy()
						reject(new Error('TCP readiness connection timed out'))
					}, Math.min(readiness.intervalMilliseconds, 1_000))

					socket.once('connect', () => {
						clearTimeout(timeout)
						socket.destroy()
						resolve()
					})
					socket.once('error', (error) => {
						clearTimeout(timeout)
						reject(error)
					})
				})
				return
			}

			const response = await fetch(readiness.endpoint, {
				signal: AbortSignal.timeout(Math.min(readiness.intervalMilliseconds, 1_000)),
			})
			const body = await response.text()

			if (
				response.status === readiness.expectedResponse.status
				&& body.includes(readiness.expectedResponse.bodyIncludes)
			)
				return

			firstFailure ??= String(new Error(
				`Readiness response did not match HTTP ${readiness.expectedResponse.status} and marker ${JSON.stringify(readiness.expectedResponse.bodyIncludes)}`
			))
		} catch (error) {
			firstFailure ??= String(error)
		}

		await delay(readiness.intervalMilliseconds)
	}

	throw new Error(
		`Readiness timed out after ${readiness.timeoutMilliseconds}ms; first failure: ${String(firstFailure)}`
	)
}

export const startHardwareWalletEmulator = async (
	configuration: HardwareWalletEmulatorConfiguration
): Promise<HardwareWalletEmulatorSession> => {
	await validateConfiguration(configuration)

	const child = spawn(
		configuration.command.executable,
		[...configuration.command.args],
		{
			cwd: configuration.command.workingDirectory,
			env: {
				...process.env,
				...configuration.command.environment,
			},
			stdio: ['pipe', 'pipe', 'pipe'],
		}
	)
	let diagnostics = ''
	let processError: Error | undefined
	let stopped = false

	child.on('error', (error) => {
		processError ??= error
	})
	child.stdout.on('data', (chunk: Buffer) => {
		diagnostics = appendDiagnostic(diagnostics, chunk)
	})
	child.stderr.on('data', (chunk: Buffer) => {
		diagnostics = appendDiagnostic(diagnostics, chunk)
	})

	const stop = async () => {
		if (stopped)
			return

		stopped = true
		await terminateOwnedProcess(child)
	}

	try {
		await waitForReadiness({
			child,
			readProcessError: () => processError,
			readiness: configuration.readiness,
		})
	} catch (cause) {
		await stop()
		throw new HardwareWalletEmulatorStartError({
			cause,
			diagnostics,
			identity: configuration.identity,
			message: `Failed to start configured ${configuration.kind} process`,
			phase: processError === cause ? 'process-unavailable' : 'readiness',
		})
	}

	if (child.pid === undefined) {
		await stop()
		throw new HardwareWalletEmulatorStartError({
			diagnostics,
			identity: configuration.identity,
			message: `Failed to obtain configured ${configuration.kind} process identity`,
			phase: 'process-unavailable',
		})
	}

	return {
		apduExchangeObserved: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: processReadiness[configuration.kind].evidenceClass,
		identity: configuration.identity,
		nativeSettlementEvidence: false,
		nativeSigningRequestConstructed: false,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		processId: child.pid,
		readiness: processReadiness[configuration.kind],
		responseAuditAvailable: false,
		stop,
		walletCapabilityEstablished: false,
	}
}
