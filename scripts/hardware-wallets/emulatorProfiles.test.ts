import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
	createBitBox02SimulatorProfile,
	createCypherockX1EmulatorProfile,
	createFireflyV1EmulatorProfile,
	createImKeyProEmulatorProfile,
	createNgraveZeroEmulatorProfile,
	createGridPlusLatticeSimulatorProfile,
	createLedgerSpeculosProfile,
	createOneKeyEmulatorProfile,
	createSafePalEmulatorProfile,
	createTrezorUserEnvProfile,
	createUnavailableHardwareWalletEmulatorProfile,
	CypherockX1EmulatorUnavailableError,
	FireflyV1EmulatorUnavailableError,
	ImKeyProEmulatorUnavailableError,
	NgraveZeroEmulatorUnavailableError,
	OneKeyProEmulatorUnavailableError,
	HardwareWalletEmulatorUnavailableError,
} from './emulatorProfiles.ts'
import {
	HardwareWalletEmulatorStartError,
	hardwareWalletProcessReadinessEvidence,
	startHardwareWalletEmulator,
} from './emulatorProcess.ts'


// Tests

test('classifies every named emulator profile as process readiness only', () => {
	// Fault: one brand's configured or ready process could be promoted into APDU, signature, physical-device, or settlement evidence.
	// Owner: shared hardware process evidence classifier. Observable: every supported kind explicitly denies every later evidence phase.
	const kinds = [
		'bitbox02-simulator',
		'gridplus-lattice-simulator',
		'ledger-speculos',
		'trezor-user-env',
	] as const

	for (const kind of kinds) {
		assert.deepEqual(hardwareWalletProcessReadinessEvidence(kind), {
			apduExchangeObserved: false,
			cryptographicSignatureVerified: false,
			emulatorProtocolExecuted: false,
			evidenceClass: 'process-readiness',
			kind,
			nativeSettlementEvidence: false,
			nativeSigningRequestConstructed: false,
			physicalHardwareEvidence: false,
			productionModelExecutionEstablished: false,
			responseAuditAvailable: false,
			walletCapabilityEstablished: false,
		})
	}
})

test('does not promote family process evidence to any enrolled production model', () => {
	// Fault: a family-level process profile could be reused as execution evidence for one or more unexercised production models.
	// Owner: shared hardware process evidence classifier. Observable: all 18 enrolled models remain outside its evidence and mapped families deny model execution.
	const models = [
		'bitbox02-multi',
		'cypherock-x1',
		'firefly-v1',
		'gridplus-lattice1',
		'imkey-pro',
		'keycard-shell',
		'keystone-pro',
		'ledger-stax',
		'ledger-nano-s',
		'ledger-nano-s-plus',
		'ledger-nano-x',
		'ledger-flex',
		'ngrave-zero',
		'onekey-pro',
		'trezor-safe-5',
		'trezor-safe-3',
		'trezor-model-one',
		'trezor-model-t',
	] as const
	const enrolledModels: ReadonlySet<string> = new Set(models)
	const familyProcessKinds = [
		'bitbox02-simulator',
		'gridplus-lattice-simulator',
		'ledger-speculos',
		'trezor-user-env',
	] as const

	assert.equal(enrolledModels.size, 18)
	for (const kind of familyProcessKinds) {
		const evidence = hardwareWalletProcessReadinessEvidence(kind)
		assert.equal(evidence.productionModelExecutionEstablished, false)
		assert.equal('model' in evidence, false)
		assert.equal(enrolledModels.has(evidence.kind), false)
	}
})

test('keeps every executable family bound to an exact command and loopback probe', () => {
	// Fault: a profile can remain named and executable while silently dropping its
	// port, application, image, or readiness identity. Owner: profile definitions.
	// Observable: each current executable family has an absolute launcher/workdir,
	// non-empty command arguments, and a loopback-only readiness coordinate.
	const profiles = [
		createBitBox02SimulatorProfile({ executable: '/opt/bitbox/simulator', identity: 'matrix-bitbox', port: 48_110, workingDirectory: '/opt/bitbox' }),
		createGridPlusLatticeSimulatorProfile({ httpPort: 48_120, identity: 'matrix-gridplus', pnpmExecutable: '/opt/pnpm', workingDirectory: '/opt/lattice' }),
		createLedgerSpeculosProfile({ apiPort: 48_130, apduPort: 48_131, applicationPath: '/opt/apps/ethereum.elf', executable: '/opt/speculos.py', identity: 'matrix-ledger', model: 'nanosp', workingDirectory: '/opt/speculos' }),
		createTrezorUserEnvProfile({ controllerPort: 48_140, dashboardPort: 48_141, dockerExecutable: '/opt/docker', identity: 'matrix-trezor', image: `ghcr.io/trezor/user-env@sha256:${'03'.repeat(32)}`, vncPort: 48_142, workingDirectory: '/opt/trezor' }),
	]

	for (const profile of profiles) {
		assert(profile.command.executable.startsWith('/'))
		assert(profile.command.workingDirectory.startsWith('/'))
		assert(profile.command.args.length > 0)
		if (profile.readiness.kind === 'tcp')
			assert.equal(profile.readiness.host, '127.0.0.1')
		else
			assert.equal(profile.readiness.endpoint.hostname, '127.0.0.1')
		assert.equal(hardwareWalletProcessReadinessEvidence(profile.kind).evidenceClass, 'process-readiness')
	}
})

test('constructs a launch profile for the official BitBox02 simulator without execution credit', () => {
	// Fault: a profile could use the default shared port and let a sibling simulator establish readiness.
	// Owner: BitBox02 simulator profile. Observable: the chosen port is passed to the binary and probed over TCP.
	const profile = createBitBox02SimulatorProfile({
		executable: '/opt/bitbox02/build-build-noasan/bin/simulator',
		identity: 'worker-1-repeat-2-bitbox02-process',
		port: 48_100,
		workingDirectory: '/opt/bitbox02',
	})

	assert.deepEqual(profile.command.args, ['--port', '48100'])
	assert.deepEqual(profile.readiness, {
		host: '127.0.0.1',
		intervalMilliseconds: 100,
		kind: 'tcp',
		port: 48_100,
		timeoutMilliseconds: 30_000,
	})
})

test('constructs a launch profile for the Lattice simulator without protocol execution credit', () => {
	// Fault: a profile could omit PORT and silently collide on the official HTTP/WebSocket port pair.
	// Owner: GridPlus simulator profile. Observable: loopback PORT configuration and Lattice UI readiness marker.
	const profile = createGridPlusLatticeSimulatorProfile({
		httpPort: 48_200,
		identity: 'worker-2-repeat-1-gridplus-process',
		pnpmExecutable: '/opt/homebrew/bin/pnpm',
		workingDirectory: '/opt/lattice-simulator',
	})

	assert.deepEqual(profile.command, {
		args: ['start'],
		environment: {
			HOSTNAME: '127.0.0.1',
			PORT: '48200',
		},
		executable: '/opt/homebrew/bin/pnpm',
		workingDirectory: '/opt/lattice-simulator',
	})
	assert.equal('endpoint' in profile.readiness && profile.readiness.endpoint.href, 'http://127.0.0.1:48200/')
})

test('keeps GridPlus process readiness below every wallet and native evidence tier', () => {
	// Fault: a Lattice-branded HTTP readiness marker is counted as an SDK request, paired response, signature, model execution, physical device, or settlement.
	// Owner: shared GridPlus process-readiness classifier. Observable: every later evidence tier is explicitly false.
	assert.deepEqual(hardwareWalletProcessReadinessEvidence('gridplus-lattice-simulator'), {
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
	})
})

test('constructs a native Speculos process with separate automation and APDU ports', () => {
	// Fault: a profile could probe the APDU socket or omit headless mode while claiming automation readiness.
	// Owner: Ledger Speculos process profile. Observable: official CLI ports and the REST events marker differ.
	const profile = createLedgerSpeculosProfile({
		apiPort: 45_000,
		apduPort: 45_001,
		applicationPath: '/opt/ledger/apps/ethereum.elf',
		executable: '/opt/speculos/speculos.py',
		identity: 'worker-2-repeat-1-ledger-ethereum',
		model: 'nanosp',
		workingDirectory: '/opt/speculos',
	})

	assert.deepEqual(profile.command.args, [
		'/opt/ledger/apps/ethereum.elf',
		'--model',
		'nanosp',
		'--display',
		'headless',
		'--api-port',
		'45000',
		'--apdu-port',
		'45001',
	])
	assert.equal(profile.readiness.endpoint.href, 'http://127.0.0.1:45000/events')
	assert.deepEqual(profile.readiness.expectedResponse, {
		bodyIncludes: '"events"',
		status: 200,
	})
})

test('constructs an owned Trezor User Env container with loopback-only official services', () => {
	// Fault: a container could expose the controller/VNC publicly or probe WebSocket/VNC as HTTP readiness.
	// Owner: Trezor User Env process profile. Observable: loopback mappings plus dashboard identity marker.
	const profile = createTrezorUserEnvProfile({
		controllerPort: 46_001,
		dashboardPort: 46_002,
		dockerExecutable: '/usr/local/bin/docker',
		identity: 'worker-3-repeat-0-trezor-user-env',
		image: `ghcr.io/trezor/trezor-user-env@sha256:${'01'.repeat(32)}`,
		vncPort: 46_003,
		workingDirectory: '/opt/trezor-user-env',
	})

	assert.deepEqual(profile.command.args, [
		'run',
		'--rm',
		'--name',
		'blockhead-worker-3-repeat-0-trezor-user-env',
		'--publish',
		'127.0.0.1:46001:9001',
		'--publish',
		'127.0.0.1:46002:9002',
		'--publish',
		'127.0.0.1:46003:15900',
		`ghcr.io/trezor/trezor-user-env@sha256:${'01'.repeat(32)}`,
	])
	assert.equal(profile.readiness.endpoint.href, 'http://127.0.0.1:46002/')
	assert.deepEqual(profile.readiness.expectedResponse, {
		bodyIncludes: 'Trezor User Env',
		status: 200,
	})
})

test('refuses unavailable concrete launchers before emulator capability exists', async () => {
	// Fault: a profile could count its configuration as emulator capability when no launcher exists.
	// Owner: concrete profile plus process boundary. Observable: typed process-unavailable errors for both brands.
	const profiles = [
		createBitBox02SimulatorProfile({
			executable: 'blockhead-absent-bitbox02-simulator',
			identity: 'worker-0-repeat-0-bitbox02-unavailable',
			port: 47_005,
			workingDirectory: process.cwd(),
		}),
		createGridPlusLatticeSimulatorProfile({
			httpPort: 47_006,
			identity: 'worker-0-repeat-0-gridplus-unavailable',
			pnpmExecutable: 'blockhead-absent-lattice-simulator',
			workingDirectory: process.cwd(),
		}),
		createLedgerSpeculosProfile({
			apiPort: 47_000,
			apduPort: 47_001,
			applicationPath: '/opt/ledger/apps/ethereum.elf',
			executable: 'blockhead-absent-speculos',
			identity: 'worker-0-repeat-0-ledger-unavailable',
			model: 'nanosp',
			workingDirectory: process.cwd(),
		}),
		createTrezorUserEnvProfile({
			controllerPort: 47_002,
			dashboardPort: 47_003,
			dockerExecutable: 'blockhead-absent-docker',
			identity: 'worker-0-repeat-0-trezor-unavailable',
			image: `ghcr.io/trezor/trezor-user-env@sha256:${'02'.repeat(32)}`,
			vncPort: 47_004,
			workingDirectory: process.cwd(),
		}),
	]

	for (const profile of profiles) {
		await assert.rejects(
			startHardwareWalletEmulator(profile),
			(error: Error) => {
				assert(error instanceof HardwareWalletEmulatorStartError)
				assert.equal(error.phase, 'process-unavailable')
				assert.equal(error.capabilityEstablished, false)
				return true
			}
		)
	}
})

test('refuses every model-only hardware family with its own missing executable boundary', () => {
	// Fault: an absent family could inherit another family's emulator, host-library,
	// or fixture evidence merely because every path ends as unavailable.
	// Owner: closed hardware-emulator profile boundary. Observable: each family
	// returns its own typed reason before any process profile can be constructed.
	const cases = [
		['cypherock', 'This harness has only Cypherock CySync'],
		['firefly', 'This harness has no verified Firefly V1'],
		['imkey', 'This harness has only imKey Core'],
		['ngrave', 'This harness has only NGRAVE QR encoding fixtures'],
		['onekey', 'This harness has only OneKey host transports'],
		['safepal', 'This harness has only SafePal QR encoding fixtures'],
	] as const

	for (const [brand, reason] of cases) {
		assert.throws(
			() => createUnavailableHardwareWalletEmulatorProfile(brand),
			(error: Error) => {
				assert(error instanceof HardwareWalletEmulatorUnavailableError)
				assert.equal(error.brand, brand)
				assert.equal(error.capabilityEstablished, false)
				assert.equal(error.cryptographicSignatureVerified, false)
				assert.equal(error.emulatorProtocolExecuted, false)
				assert.equal(error.nativeSettlementEvidence, false)
				assert.equal(error.physicalHardwareEvidence, false)
				assert.equal(error.processReadinessEstablished, false)
				assert.equal(error.productionModelExecutionEstablished, false)
				assert.equal(error.walletCapabilityEstablished, false)
				assert(error.message.includes(reason))
				return true
			}
		)
	}

	assert.throws(createOneKeyEmulatorProfile, (error: Error) => {
		assert(error instanceof HardwareWalletEmulatorUnavailableError)
		assert.equal(error.brand, 'onekey')
		return true
	})
	// Fault: a production-shaped SafePal QR fixture is credited as S1 device
	// execution. Owner: SafePal emulator profile. Observable: the named entry
	// point refuses before process or protocol evidence can be constructed.
	assert.throws(createSafePalEmulatorProfile, (error: Error) => {
		assert(error instanceof HardwareWalletEmulatorUnavailableError)
		assert.equal(error.brand, 'safepal')
		assert.equal(error.capabilityEstablished, false)
		return true
	})
})

test('keeps the Cypherock X1 model refusal distinct from sibling host integrations', () => {
	// Fault: a generic Cypherock/imKey host-library absence is credited as an X1
	// emulator result. Owner: Cypherock X1 emulator enrollment boundary. Smallest
	// observable: the named entry point throws an X1-specific typed refusal while
	// every process, protocol, signing, physical-device, and settlement tier is false.
	assert.throws(
		createCypherockX1EmulatorProfile,
		(error: Error) => {
			assert(error instanceof CypherockX1EmulatorUnavailableError)
			assert.equal(error.brand, 'cypherock')
			assert.equal(error.model, 'Cypherock X1')
			assert.equal(error.evidenceClass, 'typed-refusal')
			assert.equal(error.processReadinessEstablished, false)
			assert.equal(error.emulatorProtocolExecuted, false)
			assert.equal(error.cryptographicSignatureVerified, false)
			assert.equal(error.physicalHardwareEvidence, false)
			assert.equal(error.nativeSettlementEvidence, false)
			return true
		}
	)
})

test('keeps Firefly V1 unavailable until its own integration contract exists', () => {
	// Fault: another QR fixture, host library, or generic unavailable family is
	// credited as Firefly V1 coverage. Owner: Firefly V1 emulator enrollment
	// boundary. Smallest observable: its named entry point throws a V1-specific
	// typed refusal with every executable and native evidence tier still false.
	assert.throws(
		createFireflyV1EmulatorProfile,
		(error: Error) => {
			assert(error instanceof FireflyV1EmulatorUnavailableError)
			assert.equal(error.brand, 'firefly')
			assert.equal(error.model, 'Firefly V1')
			assert.equal(error.evidenceClass, 'typed-refusal')
			assert.equal(error.processReadinessEstablished, false)
			assert.equal(error.emulatorProtocolExecuted, false)
			assert.equal(error.cryptographicSignatureVerified, false)
			assert.equal(error.physicalHardwareEvidence, false)
			assert.equal(error.nativeSettlementEvidence, false)
			return true
		}
	)
})

test('keeps imKey Pro refusal distinct from imKey Core host integration', () => {
	// Fault: loading imKey Core host code is credited as Pro device approval or
	// emulator execution. Owner: imKey Pro emulator enrollment boundary. Smallest
	// observable: the named entry point throws a Pro-specific typed refusal while
	// every process, protocol, signing, physical-device, and settlement tier is false.
	assert.throws(
		createImKeyProEmulatorProfile,
		(error: Error) => {
			assert(error instanceof ImKeyProEmulatorUnavailableError)
			assert.equal(error.brand, 'imkey')
			assert.equal(error.model, 'imKey Pro')
			assert.equal(error.evidenceClass, 'typed-refusal')
			assert.equal(error.processReadinessEstablished, false)
			assert.equal(error.emulatorProtocolExecuted, false)
			assert.equal(error.cryptographicSignatureVerified, false)
			assert.equal(error.physicalHardwareEvidence, false)
			assert.equal(error.nativeSettlementEvidence, false)
			return true
		}
	)
})

test('keeps NGRAVE Zero refusal distinct from sibling QR encoding fixtures', () => {
	// Fault: host-side NGRAVE-shaped QR bytes are credited as ZERO key custody,
	// display, approval, or signing execution. Owner: NGRAVE Zero emulator
	// enrollment boundary. Smallest observable: its named entry point throws a
	// Zero-specific typed refusal with every executable and native tier still false.
	assert.throws(
		createNgraveZeroEmulatorProfile,
		(error: Error) => {
			assert(error instanceof NgraveZeroEmulatorUnavailableError)
			assert.equal(error.brand, 'ngrave')
			assert.equal(error.model, 'NGRAVE Zero')
			assert.equal(error.evidenceClass, 'typed-refusal')
			assert.equal(error.processReadinessEstablished, false)
			assert.equal(error.emulatorProtocolExecuted, false)
			assert.equal(error.cryptographicSignatureVerified, false)
			assert.equal(error.physicalHardwareEvidence, false)
			assert.equal(error.nativeSettlementEvidence, false)
			return true
		}
	)
})

test('keeps OneKey Pro refusal distinct from OneKey host and software integration', () => {
	// Fault: a generic OneKey transport or software wallet is credited as Pro
	// hardware/emulator execution. Owner: OneKey Pro emulator enrollment boundary.
	// Smallest observable: the existing named entry point throws a Pro-specific
	// typed refusal while every executable and native evidence tier remains false.
	assert.throws(
		createOneKeyEmulatorProfile,
		(error: Error) => {
			assert(error instanceof OneKeyProEmulatorUnavailableError)
			assert.equal(error.brand, 'onekey')
			assert.equal(error.model, 'OneKey Pro')
			assert.equal(error.evidenceClass, 'typed-refusal')
			assert.equal(error.processReadinessEstablished, false)
			assert.equal(error.emulatorProtocolExecuted, false)
			assert.equal(error.cryptographicSignatureVerified, false)
			assert.equal(error.physicalHardwareEvidence, false)
			assert.equal(error.nativeSettlementEvidence, false)
			return true
		}
	)
})

test('refuses ambiguous or unsafe profile coordinates before process startup', () => {
	// Fault: aliased ports or relative app paths could make a sibling service look like wallet capability.
	// Owner: concrete profile construction. Observable: synchronous refusal before a command is returned.
	assert.throws(
		() => createLedgerSpeculosProfile({
			apiPort: 45_000,
			apduPort: 45_000,
			applicationPath: 'apps/ethereum.elf',
			executable: 'speculos',
			identity: 'worker-0-repeat-0-ledger',
			model: 'nanosp',
			workingDirectory: '/opt/speculos',
		}),
		/must be distinct/
	)
	assert.throws(
		() => createLedgerSpeculosProfile({
			apiPort: 45_000,
			apduPort: 45_001,
			applicationPath: 'apps/ethereum.elf',
			executable: 'speculos',
			identity: 'worker-0-repeat-0-ledger',
			model: 'nanosp',
			workingDirectory: '/opt/speculos',
		}),
		/must be absolute/
	)
	assert.throws(
		() => createTrezorUserEnvProfile({
			controllerPort: 46_001,
			dashboardPort: 46_002,
			dockerExecutable: 'docker',
			identity: 'worker-0-repeat-0-trezor',
			image: '--privileged',
			vncPort: 46_003,
			workingDirectory: '/opt/trezor-user-env',
		}),
		/pinned Docker image reference/
	)
})
