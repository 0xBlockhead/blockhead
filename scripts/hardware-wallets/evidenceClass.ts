import { access, constants, realpath } from 'node:fs/promises'

/** Executable harness boundary; injected callbacks are the installed-tool adapter seam. */
export type HardwareWalletEvidenceBrand = 'bitbox02' | 'gridplus-lattice' | 'keycard' | 'keystone' | 'ledger-speculos' | 'trezor-user-env'
type HarnessDefinition = Readonly<{ brand: HardwareWalletEvidenceBrand; protocol: 'apdu' | 'json-rpc' | 'http' | 'websocket' | 'qr' | 'iso7816-apdu' }>
export const hardwareWalletHarnessDefinitions: Readonly<Record<HardwareWalletEvidenceBrand, HarnessDefinition>> = {
	bitbox02: { brand: 'bitbox02', protocol: 'json-rpc' },
	'gridplus-lattice': { brand: 'gridplus-lattice', protocol: 'websocket' },
	keycard: { brand: 'keycard', protocol: 'iso7816-apdu' },
	keystone: { brand: 'keystone', protocol: 'qr' },
	'ledger-speculos': { brand: 'ledger-speculos', protocol: 'apdu' },
	'trezor-user-env': { brand: 'trezor-user-env', protocol: 'http' },
}
export type HardwareWalletEvidence = Readonly<{ brand: HardwareWalletEvidenceBrand; phase: 'process-readiness' | 'native-transport' | 'cryptographic-signature'; capabilityEstablished: boolean; emulatorProtocolExecuted: boolean; cryptographicSignatureVerified: boolean; physicalHardwareEvidence: false; nativeSettlementEvidence: false }>
export class HardwareWalletEvidenceUnavailableError extends Error {
	readonly capabilityEstablished = false
	readonly physicalHardwareEvidence = false
	readonly nativeSettlementEvidence = false
	constructor(readonly brand: HardwareWalletEvidenceBrand, reason: string) { super(`${brand} harness unavailable: ${reason}`); this.name = 'HardwareWalletEvidenceUnavailableError' }
}

export type HardwareWalletExecutableDiscovery = Readonly<{
	brand: HardwareWalletEvidenceBrand
	executable: string
	status: 'absent' | 'ready'
}>

export const discoverHardwareWalletExecutable = async ({
	brand,
	executable,
}: Readonly<Pick<HardwareWalletExecutableDiscovery, 'brand' | 'executable'>>): Promise<HardwareWalletExecutableDiscovery> => {
	if (executable.trim() === '') return { brand, executable, status: 'absent' }
	try {
		const resolved = await realpath(executable)
		await access(resolved, constants.X_OK)
		return { brand, executable: resolved, status: 'ready' }
	}
	catch {
		return { brand, executable, status: 'absent' }
	}
}
export const executeHardwareWalletHarness = async ({ brand, executable, readinessProbe, nativeTransport, verifyExactSignature }: Readonly<{ brand: HardwareWalletEvidenceBrand; executable: string; readinessProbe: () => Promise<boolean>; nativeTransport: () => Promise<unknown>; verifyExactSignature: (response: unknown) => Promise<boolean> }>): Promise<HardwareWalletEvidence> => {
	if (executable.trim() === '') throw new HardwareWalletEvidenceUnavailableError(brand, 'vendor executable is not configured')
	if (!await readinessProbe()) throw new HardwareWalletEvidenceUnavailableError(brand, 'process readiness probe failed')
	const response = await nativeTransport()
	if (!await verifyExactSignature(response)) return { brand, capabilityEstablished: false, cryptographicSignatureVerified: false, emulatorProtocolExecuted: true, nativeSettlementEvidence: false, phase: 'native-transport', physicalHardwareEvidence: false }
	return { brand, capabilityEstablished: true, cryptographicSignatureVerified: true, emulatorProtocolExecuted: true, nativeSettlementEvidence: false, phase: 'cryptographic-signature', physicalHardwareEvidence: false }
}
