import assert from 'node:assert/strict'
import { type } from 'arktype'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { access, mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
	HardwareWalletEmulatorStartError,
	startHardwareWalletEmulator,
} from './emulatorProcess.ts'


// Helpers

const fixturePath = join(
	dirname(fileURLToPath(import.meta.url)),
	'fixtures/readiness-server.mjs'
)

const reservePort = async () => {
	const server = createServer()
	server.listen(0, '127.0.0.1')
	await once(server, 'listening')
	const address = type({ port: 'number', address: 'string', family: 'string' }).assert(server.address())

	await new Promise<void>((resolve, reject) => {
		server.close((error) => error === undefined ? resolve() : reject(error))
	})

	return address.port
}

const configuration = ({
	identity,
	kind,
	mode = 'ready',
	port,
	workingDirectory,
}: {
	identity: string
	kind: 'gridplus-lattice-simulator' | 'ledger-speculos' | 'trezor-user-env'
	mode?: 'never-ready' | 'ready'
	port: number
	workingDirectory: string
}) => ({
	command: {
		args: [fixturePath, mode, String(port)],
		executable: process.execPath,
		workingDirectory,
	},
	identity,
	kind,
	readiness: {
		endpoint: new URL(`http://127.0.0.1:${port}/health`),
		expectedResponse: {
			bodyIncludes: '"ready":true',
			status: 200,
		},
		intervalMilliseconds: 50,
		timeoutMilliseconds: 3_000,
	},
})

const processExists = async (processId: number) => {
	try {
		process.kill(processId, 0)
		return true
	} catch {
		return false
	}
}


// Tests

test('reports only process readiness and owns exact process cleanup', async (context) => {
	// Fault: a generic ready process could be promoted to wallet-emulator capability or leak its child.
	// Owner: hardware process lifecycle. Observable: explicit non-capability readiness plus dead owned PID after stop.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()
	const session = await startHardwareWalletEmulator(configuration({
		identity: 'worker-0-repeat-0-ledger',
		kind: 'ledger-speculos',
		port,
		workingDirectory,
	}))

	assert.deepEqual(session.readiness, {
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
	})
	assert.equal(session.evidenceClass, 'process-readiness')
	assert.equal(session.walletCapabilityEstablished, false)
	assert.equal(await processExists(session.processId), true)
	await session.stop()
	await session.stop()
	assert.equal(await processExists(session.processId), false)
})

test('reports BitBox02-profile process readiness only after its socket accepts connections', async (context) => {
	// Fault: a listening generic fixture could be mistaken for a BitBox02 wallet simulator.
	// Owner: TCP process-readiness boundary. Observable: readiness remains explicit non-capability evidence and cleanup kills only that PID.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()
	const session = await startHardwareWalletEmulator({
		...configuration({
			identity: 'worker-1-repeat-0-bitbox02',
			kind: 'ledger-speculos',
			port,
			workingDirectory,
		}),
		kind: 'bitbox02-simulator',
		readiness: {
			host: '127.0.0.1',
			intervalMilliseconds: 50,
			kind: 'tcp',
			port,
			timeoutMilliseconds: 3_000,
		},
	})

	assert.deepEqual(session.readiness, {
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
	})
	assert.equal(session.evidenceClass, 'process-readiness')
	assert.equal(session.walletCapabilityEstablished, false)
	await session.stop()
	assert.equal(await processExists(session.processId), false)
})

test('keeps GridPlus HTTP readiness below protocol execution and settlement', async (context) => {
	// Fault: a healthy Lattice-branded HTTP service could be mistaken for a signed request or a settled native action.
	// Owner: GridPlus process lifecycle. Observable: HTTP readiness yields only process evidence and the owned child is cleaned up.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()
	const session = await startHardwareWalletEmulator({
		...configuration({
			identity: 'worker-2-repeat-0-gridplus',
			kind: 'gridplus-lattice-simulator',
			port,
			workingDirectory,
		}),
		readiness: {
			endpoint: new URL(`http://127.0.0.1:${port}/health`),
			expectedResponse: {
				bodyIncludes: '"ready":true',
				status: 200,
			},
			intervalMilliseconds: 50,
			timeoutMilliseconds: 3_000,
		},
	})

	assert.equal(session.readiness.kind, 'gridplus-lattice-simulator')
	assert.equal(session.readiness.emulatorProtocolExecuted, false)
	assert.equal(session.readiness.cryptographicSignatureVerified, false)
	assert.equal(session.readiness.nativeSettlementEvidence, false)
	assert.equal(session.readiness.physicalHardwareEvidence, false)
	await session.stop()
	assert.equal(await processExists(session.processId), false)
})

test('keeps independently owned emulator processes alive', async (context) => {
	// Fault: cleanup could kill a sibling emulator that shares a suite or process group.
	// Owner: session cleanup. Observable: sibling readiness remains reachable after the first session stops.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const firstPort = await reservePort()
	const secondPort = await reservePort()
	const first = await startHardwareWalletEmulator(configuration({
		identity: 'worker-0-repeat-0-ledger',
		kind: 'ledger-speculos',
		port: firstPort,
		workingDirectory,
	}))
	const second = await startHardwareWalletEmulator(configuration({
		identity: 'worker-0-repeat-0-trezor',
		kind: 'trezor-user-env',
		port: secondPort,
		workingDirectory,
	}))
	context.after(() => second.stop())

	await first.stop()
	assert.equal((await fetch(`http://127.0.0.1:${secondPort}/health`)).status, 200)
	assert.equal(await processExists(second.processId), true)
})

test('fails closed on bounded readiness timeout and retains first diagnostics', async (context) => {
	// Fault: a hung emulator could be accepted, leak, or lose its earliest causal diagnostic.
	// Owner: readiness controller. Observable: typed timeout error with stderr and no surviving child.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()
	let error: HardwareWalletEmulatorStartError | undefined

	try {
		await startHardwareWalletEmulator({
			...configuration({
				identity: 'worker-0-repeat-0-timeout',
				kind: 'trezor-user-env',
				mode: 'never-ready',
				port,
				workingDirectory,
			}),
			readiness: {
				endpoint: new URL(`http://127.0.0.1:${port}/health`),
				expectedResponse: {
					bodyIncludes: '"ready":true',
					status: 200,
				},
				intervalMilliseconds: 50,
				timeoutMilliseconds: 3_000,
			},
		})
	} catch (caught) {
		if (caught instanceof HardwareWalletEmulatorStartError)
			error = caught
	}

	assert.ok(error)
	assert.equal(error.phase, 'readiness')
	assert.match(error.cause instanceof Error ? error.cause.message : '', /timed out after 3000ms/)
	assert.match(error.diagnostics, /fixture-first-failure/)
})

test('does not accept a healthy but unrelated loopback service as emulator readiness', async (context) => {
	// Fault: a stale process on the configured port could falsely establish emulator capability.
	// Owner: readiness controller. Observable: wrong response identity times out and the child is cleaned up.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()

	await assert.rejects(
		startHardwareWalletEmulator({
			...configuration({
				identity: 'worker-0-repeat-0-wrong-service',
				kind: 'ledger-speculos',
				port,
				workingDirectory,
			}),
			readiness: {
				endpoint: new URL(`http://127.0.0.1:${port}/health`),
				expectedResponse: {
					bodyIncludes: 'speculos-ready',
					status: 200,
				},
				intervalMilliseconds: 50,
				timeoutMilliseconds: 3_000,
			},
		}),
		(error: Error) => {
			assert(error instanceof HardwareWalletEmulatorStartError)
			assert.equal(error.phase, 'readiness')
			assert(/fixture-ready/.test(error.diagnostics))
			return true
		}
	)
})

test('rejects traversal and nonexistent working directories without writing', async (context) => {
	// Fault: validation could traverse a relative command or create a missing workspace as a side effect.
	// Owner: command boundary. Observable: rejection before spawn and unchanged parent directory.
	const parent = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-validation-'))
	context.after(() => rm(parent, { force: true, recursive: true }))
	const missing = join(parent, 'must-not-be-created')
	const before = await readdir(parent)
	const port = await reservePort()

	await assert.rejects(
		startHardwareWalletEmulator({
			...configuration({
				identity: 'worker-0-repeat-0-traversal',
				kind: 'ledger-speculos',
				port,
				workingDirectory: parent,
			}),
			command: {
				args: [],
				executable: '../speculos',
				workingDirectory: parent,
			},
		}),
		/absolute path/
	)
	await assert.rejects(
		startHardwareWalletEmulator(configuration({
			identity: 'worker-0-repeat-0-no-write',
			kind: 'ledger-speculos',
			port,
			workingDirectory: missing,
		}))
	)
	await assert.rejects(access(missing))
	assert.deepEqual(await readdir(parent), before)
})

test('reports an unavailable configured executable without installing a fallback', async (context) => {
	// Fault: a missing emulator could trigger an implicit installer or surface as a readiness timeout.
	// Owner: process launch boundary. Observable: the original ENOENT is retained in a typed start error.
	const workingDirectory = await mkdtemp(join(tmpdir(), 'blockhead-hardware-emulator-'))
	context.after(() => rm(workingDirectory, { force: true, recursive: true }))
	const port = await reservePort()

	await assert.rejects(
		startHardwareWalletEmulator({
			...configuration({
				identity: 'worker-0-repeat-0-unavailable',
				kind: 'trezor-user-env',
				port,
				workingDirectory,
			}),
			command: {
				args: [],
				executable: 'blockhead-deliberately-absent-emulator',
				workingDirectory,
			},
		}),
		(error: Error) => {
			assert(error instanceof HardwareWalletEmulatorStartError)
			assert.equal(error.phase, 'process-unavailable')
			assert(error.cause instanceof Error)
			assert(/ENOENT/.test(error.cause.message))
			return true
		}
	)
})
