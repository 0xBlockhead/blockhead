// A phase diagnostic is navigation evidence only. It cannot establish wallet,
// emulator, physical-device, signature, or native-settlement capability.

export type HardwareHarnessPhase =
	| 'artifact'
	| 'process'
	| 'transport'
	| 'protocol'
	| 'cryptographic-verification'

export type HardwareHarnessPhaseObservation = {
	detail: string
	outcome: 'failed' | 'passed'
}

export type HardwareHarnessPhaseDiagnostic = {
	capabilityEstablished: false
	cryptographicSignatureVerified: false
	emulatorProtocolExecuted: false
	evidenceClass: 'harness-phase-diagnostic'
	nativeSettlementEvidence: false
	nextPhase: HardwareHarnessPhase | null
	phases: readonly {
		detail?: string
		phase: HardwareHarnessPhase
		state: 'blocked' | 'failed' | 'passed' | 'pending'
	}[]
	physicalHardwareEvidence: false
	productionModelExecutionEstablished: false
	walletCapabilityEstablished: false
}

const phaseOrder = [
	'artifact',
	'process',
	'transport',
	'protocol',
	'cryptographic-verification',
] as const satisfies readonly HardwareHarnessPhase[]

export const diagnoseHardwareHarnessPhases = (
	observations: Partial<Readonly<Record<HardwareHarnessPhase, HardwareHarnessPhaseObservation>>>
): HardwareHarnessPhaseDiagnostic => {
	let prerequisiteOpen = true
	let nextPhase: HardwareHarnessPhase | null = null
	const phases: HardwareHarnessPhaseDiagnostic['phases'][number][] = []

	for (const phase of phaseOrder) {
		const observation = observations[phase]

		if (!prerequisiteOpen) {
			if (observation !== undefined)
				throw new Error(`Hardware harness ${phase} evidence precedes its required phase`)
			phases.push({ phase, state: 'blocked' })
			continue
		}

		if (observation === undefined) {
			nextPhase ??= phase
			prerequisiteOpen = false
			phases.push({ phase, state: 'pending' })
			continue
		}

		if (observation.detail.trim() === '')
			throw new Error(`Hardware harness ${phase} observation requires a diagnostic detail`)

		phases.push({
			detail: observation.detail,
			phase,
			state: observation.outcome,
		})
		if (observation.outcome === 'failed') {
			nextPhase = phase
			prerequisiteOpen = false
		}
	}

	return {
		capabilityEstablished: false,
		cryptographicSignatureVerified: false,
		emulatorProtocolExecuted: false,
		evidenceClass: 'harness-phase-diagnostic',
		nativeSettlementEvidence: false,
		nextPhase,
		phases,
		physicalHardwareEvidence: false,
		productionModelExecutionEstablished: false,
		walletCapabilityEstablished: false,
	}
}
