import { isAbsolute } from 'node:path'

import type { HardwareWalletEmulatorConfiguration } from './emulatorProcess.ts'


// Types

type EmulatorProfileIdentity = {
	identity: string
	workingDirectory: string
}

type HardwareWalletHttpEmulatorConfiguration = Omit<
	HardwareWalletEmulatorConfiguration,
	'readiness'
> & {
	readiness: Extract<
		HardwareWalletEmulatorConfiguration['readiness'],
		{ endpoint: URL }
	>
}

type HardwareWalletTcpEmulatorConfiguration = Omit<
	HardwareWalletEmulatorConfiguration,
	'readiness'
> & {
	readiness: Extract<
		HardwareWalletEmulatorConfiguration['readiness'],
		{ kind: 'tcp' }
	>
}

export type LedgerSpeculosProfileInput = EmulatorProfileIdentity & {
	apiPort: number
	apduPort: number
	applicationPath: string
	executable: string
	model: 'flex' | 'nanox' | 'nanos' | 'nanosp' | 'stax'
}

export type TrezorUserEnvProfileInput = EmulatorProfileIdentity & {
	controllerPort: number
	dashboardPort: number
	dockerExecutable: string
	image: string
	vncPort: number
}

export type BitBox02SimulatorProfileInput = EmulatorProfileIdentity & {
	executable: string
	port: number
}

export type GridPlusLatticeSimulatorProfileInput = EmulatorProfileIdentity & {
	httpPort: number
	pnpmExecutable: string
}

export type HardwareWalletWithoutExecutableEmulator =
	| 'cypherock'
	| 'firefly'
	| 'imkey'
	| 'ngrave'
	| 'onekey'
	| 'safepal'

const unavailableEmulatorReason = {
	cypherock: 'This harness has only Cypherock CySync device/card authentication mocks, not an enrolled X1 Vault and CyCard signing-device emulator',
	firefly: 'This harness has no verified Firefly V1 external integration contract or enrolled deterministic signing-device emulator',
	imkey: 'This harness has only imKey Core host integration, not an enrolled imKey Pro approval and signing-device emulator',
	ngrave: 'This harness has only NGRAVE QR encoding fixtures, with no enrolled ZERO key-custody, display, and approval emulator',
	onekey: 'This harness has only OneKey host transports, not an enrolled deterministic signing-device emulator',
	safepal: 'This harness has only SafePal QR encoding fixtures, with no enrolled S1 key-custody, display, and approval emulator',
} as const satisfies Record<HardwareWalletWithoutExecutableEmulator, string>

export class HardwareWalletEmulatorUnavailableError extends Error {
	readonly brand: HardwareWalletWithoutExecutableEmulator
	readonly capabilityEstablished = false
	readonly cryptographicSignatureVerified = false
	readonly emulatorProtocolExecuted = false
	readonly nativeSettlementEvidence = false
	readonly physicalHardwareEvidence = false
	readonly processReadinessEstablished = false
	readonly productionModelExecutionEstablished = false
	readonly walletCapabilityEstablished = false

	constructor(brand: HardwareWalletWithoutExecutableEmulator) {
		super(
			`${unavailableEmulatorReason[brand]}; physical hardware or an official emulator with reproducible seed and approval control is required`
		)
		this.name = 'HardwareWalletEmulatorUnavailableError'
		this.brand = brand
	}
}

export class CypherockX1EmulatorUnavailableError extends HardwareWalletEmulatorUnavailableError {
	readonly evidenceClass = 'typed-refusal'
	readonly model = 'Cypherock X1'

	constructor() {
		super('cypherock')
		this.name = 'CypherockX1EmulatorUnavailableError'
	}
}

export class FireflyV1EmulatorUnavailableError extends HardwareWalletEmulatorUnavailableError {
	readonly evidenceClass = 'typed-refusal'
	readonly model = 'Firefly V1'

	constructor() {
		super('firefly')
		this.name = 'FireflyV1EmulatorUnavailableError'
	}
}

export class ImKeyProEmulatorUnavailableError extends HardwareWalletEmulatorUnavailableError {
	readonly evidenceClass = 'typed-refusal'
	readonly model = 'imKey Pro'

	constructor() {
		super('imkey')
		this.name = 'ImKeyProEmulatorUnavailableError'
	}
}

export class NgraveZeroEmulatorUnavailableError extends HardwareWalletEmulatorUnavailableError {
	readonly evidenceClass = 'typed-refusal'
	readonly model = 'NGRAVE Zero'

	constructor() {
		super('ngrave')
		this.name = 'NgraveZeroEmulatorUnavailableError'
	}
}

export class OneKeyProEmulatorUnavailableError extends HardwareWalletEmulatorUnavailableError {
	readonly evidenceClass = 'typed-refusal'
	readonly model = 'OneKey Pro'

	constructor() {
		super('onekey')
		this.name = 'OneKeyProEmulatorUnavailableError'
	}
}


// Constants

const loopback = '127.0.0.1'
const readinessIntervalMilliseconds = 100
const readinessTimeoutMilliseconds = 30_000


// Functions

const requirePort = (label: string, port: number) => {
	if (!Number.isInteger(port) || port < 1_024 || port > 65_535)
		throw new Error(`${label} must be an unprivileged TCP port`)
}

const requireDistinctPorts = (ports: Readonly<Record<string, number>>) => {
	if (new Set(Object.values(ports)).size !== Object.keys(ports).length)
		throw new Error('Emulator profile ports must be distinct')
}

export const createUnavailableHardwareWalletEmulatorProfile = (
	brand: HardwareWalletWithoutExecutableEmulator
): HardwareWalletEmulatorConfiguration => {
	throw new HardwareWalletEmulatorUnavailableError(brand)
}

export const createCypherockX1EmulatorProfile = (): never => {
	throw new CypherockX1EmulatorUnavailableError()
}

export const createFireflyV1EmulatorProfile = (): never => {
	throw new FireflyV1EmulatorUnavailableError()
}

export const createImKeyProEmulatorProfile = (): never => {
	throw new ImKeyProEmulatorUnavailableError()
}

export const createNgraveZeroEmulatorProfile = (): never => {
	throw new NgraveZeroEmulatorUnavailableError()
}

export const createOneKeyEmulatorProfile = (): never => {
	throw new OneKeyProEmulatorUnavailableError()
}

export const createSafePalEmulatorProfile = (): HardwareWalletEmulatorConfiguration => (
	createUnavailableHardwareWalletEmulatorProfile('safepal')
)

export const createBitBox02SimulatorProfile = ({
	executable,
	identity,
	port,
	workingDirectory,
}: BitBox02SimulatorProfileInput): HardwareWalletTcpEmulatorConfiguration => {
	requirePort('BitBox02 simulator port', port)

	return {
		command: {
			args: [
				'--port',
				String(port),
			],
			executable,
			workingDirectory,
		},
		identity,
		kind: 'bitbox02-simulator',
		readiness: {
			host: loopback,
			intervalMilliseconds: readinessIntervalMilliseconds,
			kind: 'tcp',
			port,
			timeoutMilliseconds: readinessTimeoutMilliseconds,
		},
	}
}

export const createGridPlusLatticeSimulatorProfile = ({
	httpPort,
	identity,
	pnpmExecutable,
	workingDirectory,
}: GridPlusLatticeSimulatorProfileInput): HardwareWalletHttpEmulatorConfiguration => {
	requirePort('GridPlus Lattice HTTP port', httpPort)
	const websocketPort = httpPort + 443
	requirePort('GridPlus Lattice WebSocket port', websocketPort)
	requireDistinctPorts({ httpPort, websocketPort })

	return {
		command: {
			args: ['start'],
			environment: {
				HOSTNAME: loopback,
				PORT: String(httpPort),
			},
			executable: pnpmExecutable,
			workingDirectory,
		},
		identity,
		kind: 'gridplus-lattice-simulator',
		readiness: {
			endpoint: new URL(`http://${loopback}:${httpPort}/`),
			expectedResponse: {
				bodyIncludes: 'Lattice',
				status: 200,
			},
			intervalMilliseconds: readinessIntervalMilliseconds,
			timeoutMilliseconds: readinessTimeoutMilliseconds,
		},
	}
}

export const createLedgerSpeculosProfile = ({
	apiPort,
	apduPort,
	applicationPath,
	executable,
	identity,
	model,
	workingDirectory,
}: LedgerSpeculosProfileInput): HardwareWalletHttpEmulatorConfiguration => {
	requirePort('Speculos API port', apiPort)
	requirePort('Speculos APDU port', apduPort)
	requireDistinctPorts({ apiPort, apduPort })

	if (!isAbsolute(applicationPath))
		throw new Error('Speculos application path must be absolute')

	return {
		command: {
			args: [
				applicationPath,
				'--model',
				model,
				'--display',
				'headless',
				'--api-port',
				String(apiPort),
				'--apdu-port',
				String(apduPort),
			],
			executable,
			workingDirectory,
		},
		identity,
		kind: 'ledger-speculos',
		readiness: {
			endpoint: new URL(`http://${loopback}:${apiPort}/events`),
			expectedResponse: {
				bodyIncludes: '"events"',
				status: 200,
			},
			intervalMilliseconds: readinessIntervalMilliseconds,
			timeoutMilliseconds: readinessTimeoutMilliseconds,
		},
	}
}

export const createTrezorUserEnvProfile = ({
	controllerPort,
	dashboardPort,
	dockerExecutable,
	identity,
	image,
	vncPort,
	workingDirectory,
}: TrezorUserEnvProfileInput): HardwareWalletHttpEmulatorConfiguration => {
	requirePort('Trezor controller port', controllerPort)
	requirePort('Trezor dashboard port', dashboardPort)
	requirePort('Trezor VNC port', vncPort)
	requireDistinctPorts({ controllerPort, dashboardPort, vncPort })

	if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]{0,190}@sha256:[a-f0-9]{64}$/.test(image))
		throw new Error('Trezor User Env image must be a pinned Docker image reference')

	return {
		command: {
			args: [
				'run',
				'--rm',
				'--name',
				`blockhead-${identity}`,
				'--publish',
				`${loopback}:${controllerPort}:9001`,
				'--publish',
				`${loopback}:${dashboardPort}:9002`,
				'--publish',
				`${loopback}:${vncPort}:15900`,
				image,
			],
			executable: dockerExecutable,
			workingDirectory,
		},
		identity,
		kind: 'trezor-user-env',
		readiness: {
			endpoint: new URL(`http://${loopback}:${dashboardPort}/`),
			expectedResponse: {
				bodyIncludes: 'Trezor User Env',
				status: 200,
			},
			intervalMilliseconds: readinessIntervalMilliseconds,
			timeoutMilliseconds: readinessTimeoutMilliseconds,
		},
	}
}
