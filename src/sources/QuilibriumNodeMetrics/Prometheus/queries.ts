import { getPrometheusText } from '$/sources/_shared/wire/Prometheus/client.ts'
import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const getMetrics = () => (
	getPrometheusText(bindings[Source.QuilibriumNodeMetrics_Prometheus][0])
)

const prometheusSampleLine = /^(?<name>[a-zA-Z_:][a-zA-Z0-9_:]*)(?:\{[^}]*\})?\s+(?<value>[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)(?:\s+\d+)?\s*$/

export const parsePrometheusGaugeSamples = (
	text: string
) => (
	Object.fromEntries(
		text
			.split('\n')
			.flatMap((line) => {
				const trimmed = line.trim()
				if (trimmed === '' || trimmed.startsWith('#'))
					return []

				const match = prometheusSampleLine.exec(trimmed)
				if (match?.groups == null)
					return []

				const value = Number(match.groups.value)
				if (!Number.isFinite(value))
					return []

				return [[
					match.groups.name,
					value,
				] as const]
			})
	) as Record<string, number>
)

const gaugeEndingWith = (
	gauges: Record<string, number>,
	suffix: string
) => {
	const exact = gauges[suffix]
	if (exact != null)
		return exact

	const match = Object.entries(gauges).find(([name]) => (
		name === suffix
		|| name.endsWith(`_${suffix}`)
		|| name.endsWith(suffix)
	))
	return match?.[1]
}

const preferSubsystemGauge = (
	gauges: Record<string, number>,
	suffix: string,
	preferred: string
) => {
	const preferredMatch = Object.entries(gauges).find(([name]) => (
		name.includes(preferred)
		&& (
			name === suffix
			|| name.endsWith(`_${suffix}`)
			|| name.endsWith(suffix)
		)
	))
	if (preferredMatch != null)
		return preferredMatch[1]

	return gaugeEndingWith(gauges, suffix)
}

const engineStateLabelByCode = [
	'stopped',
	'starting',
	'loading',
	'collecting',
	'proving',
	'publishing',
	'verifying',
	'stopping',
] as const

export const nodeStateObservationFromPrometheusText = (
	text: string,
	observedAtMs = Date.now()
) => {
	const gauges = parsePrometheusGaugeSamples(text)
	const engineStateCode = preferSubsystemGauge(gauges, 'engine_state', 'app_consensus')
	const latestFrameNumber = preferSubsystemGauge(gauges, 'current_frame_number', 'app_consensus')
	const frameStoreHead = preferSubsystemGauge(gauges, 'current_frame_number', 'global_consensus')
	const difficulty = preferSubsystemGauge(gauges, 'current_difficulty', 'app_consensus')
	const pendingMessageCount = preferSubsystemGauge(gauges, 'pending_messages_count', 'app_consensus')
	const peerCount = (
		gaugeEndingWith(gauges, 'peer_count')
		?? gaugeEndingWith(gauges, 'peers')
	)
	const secondsSinceLastProven = preferSubsystemGauge(gauges, 'time_since_last_proven_frame_seconds', 'app_consensus')
	const nodeVersion = (
		Object.entries(gauges).find(([name]) => name.includes('build_info') || name.endsWith('_version'))?.[0]
	)

	return {
		...(
			engineStateCode != null
			&& Number.isInteger(engineStateCode)
			&& engineStateCode >= 0
			&& engineStateCode < engineStateLabelByCode.length
			&& {
				engineState: engineStateLabelByCode[engineStateCode],
			}
		),
		...(
			latestFrameNumber != null
			&& Number.isFinite(latestFrameNumber)
			&& {
				latestFrameNumber: BigInt(Math.trunc(latestFrameNumber)),
			}
		),
		...(
			frameStoreHead != null
			&& Number.isFinite(frameStoreHead)
			&& {
				frameStoreHead: BigInt(Math.trunc(frameStoreHead)),
			}
		),
		...(
			difficulty != null
			&& Number.isFinite(difficulty)
			&& {
				difficulty: BigInt(Math.trunc(difficulty)),
			}
		),
		...(
			pendingMessageCount != null
			&& Number.isFinite(pendingMessageCount)
			&& {
				pendingMessageCount: Math.trunc(pendingMessageCount),
			}
		),
		...(
			peerCount != null
			&& Number.isFinite(peerCount)
			&& {
				peerCount: Math.trunc(peerCount),
			}
		),
		...(
			secondsSinceLastProven != null
			&& Number.isFinite(secondsSinceLastProven)
			&& {
				lastSyncedAt: Math.trunc(observedAtMs - (secondsSinceLastProven * 1000)),
			}
		),
		...(
			nodeVersion != null
			&& {
				nodeVersion,
			}
		),
	}
}
