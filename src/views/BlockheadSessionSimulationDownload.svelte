<script module lang="ts">
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type {
		EntityProxyData,
		EntityProxyEntitiesData,
	} from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'

	export const simulationExportSelection = {
		fields: {
			status: true,
			createdAt: true,
			completedAt: true,
			paramsHash: true,
			forkBlockNumber: true,
			forkRpcOrigin: true,
			actionCount: true,
			gasUsed: true,
			resultPayloadHash: true,
			error: true,
		},
	} as const

	export const sessionExportSelection = {
		sources: [
			Source.Local_Internal,
		],
	} as const

	export const callsExportSelection = {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			callPath: true,
			parentCallPath: true,
			depth: true,
			callIndex: true,
			callType: true,
			fromAddress: true,
			toAddress: true,
			value: true,
			inputSelector: true,
			inputDataHash: true,
			outputDataHash: true,
			gasUsed: true,
			reverted: true,
			error: true,
		},
	} as const

	export const logsExportSelection = {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			logIndex: true,
			callPath: true,
			address: true,
			topic0: true,
			topics: true,
			dataHash: true,
			decodedEventName: true,
			decodedArgs: true,
			removed: true,
		},
	} as const

	type SelectedSimulation = EntityProxyData<
		typeof schema,
		EntityType.BlockheadSessionSimulation,
		typeof simulationExportSelection
	>
	type Simulation = SelectedSimulation['fields']

	type SelectedSession = SubscribeEntityReferenceResult<
		typeof schema,
		EntityType.BlockheadSession,
		typeof sessionExportSelection
	>
	type Session = Pick<SelectedSession, 'entitySelector'>

	type SelectedSimulationCalls = EntityProxyEntitiesData<
		typeof schema,
		EntityType.BlockheadSessionSimulationCall,
		typeof callsExportSelection
	>
	type SimulationCall = Pick<
		SelectedSimulationCalls['values'][number],
		| 'callPath'
		| 'parentCallPath'
		| 'depth'
		| 'callIndex'
		| 'callType'
		| 'fromAddress'
		| 'toAddress'
		| 'value'
		| 'inputSelector'
		| 'inputDataHash'
		| 'outputDataHash'
		| 'gasUsed'
		| 'reverted'
		| 'error'
	>
	type SimulationCalls = {
		values: readonly SimulationCall[]
	}

	type SelectedSimulationLogs = EntityProxyEntitiesData<
		typeof schema,
		EntityType.BlockheadSessionSimulationLog,
		typeof logsExportSelection
	>
	type SimulationLog = Pick<
		SelectedSimulationLogs['values'][number],
		| 'logIndex'
		| 'callPath'
		| 'address'
		| 'topic0'
		| 'topics'
		| 'dataHash'
		| 'decodedEventName'
		| 'decodedArgs'
		| 'removed'
	>
	type SimulationLogs = {
		values: readonly SimulationLog[]
	}

	export type BlockheadSessionSimulationDownloadProps = {
		simulationId: string
		simulation: SvelteKitResource<Simulation>
		session: SvelteKitResource<Session>
		calls: SvelteKitResource<SimulationCalls>
		callCount: SvelteKitResource<number>
		logs: SvelteKitResource<SimulationLogs>
		logCount: SvelteKitResource<number>
	}
</script>


<script lang="ts">
	// State
	let {
		simulationId,
		simulation,
		session,
		calls,
		callCount,
		logs,
		logCount,
	}: BlockheadSessionSimulationDownloadProps = $props()


	// Functions
	const compareCallPaths = (left: string, right: string) => {
		if (left === right)
			return 0
		if (left === 'root')
			return -1
		if (right === 'root')
			return 1

		const leftSegments = left.split('.').map(Number)
		const rightSegments = right.split('.').map(Number)
		for (let index = 0; index < Math.min(leftSegments.length, rightSegments.length); index += 1) {
			const difference = leftSegments[index] - rightSegments[index]
			if (difference !== 0)
				return difference
		}

		return leftSegments.length - rightSegments.length
	}

	const decimalStringOrNull = (value: bigint | undefined) => value?.toString() ?? null

	const downloadSimulation = (
		loadedSimulation: Simulation,
		loadedSession: Session,
		loadedCalls: SimulationCalls,
		loadedLogs: SimulationLogs
	) => {
		const content = `${JSON.stringify({
			schemaVersion: 1,
			kind: 'blockhead.sessionSimulation',
			selector: {
				id: simulationId,
			},
			source: Source.Local_Internal,
			exportedAtMs: Date.now(),
			simulation: {
				id: simulationId,
				session: {
					sessionId: loadedSession.entitySelector.id,
				},
				status: loadedSimulation.status,
				createdAt: loadedSimulation.createdAt,
				completedAt: loadedSimulation.completedAt ?? null,
				paramsHash: loadedSimulation.paramsHash,
				forkBlockNumber: decimalStringOrNull(loadedSimulation.forkBlockNumber),
				forkRpcOrigin: loadedSimulation.forkRpcOrigin ?? null,
				actionCount: loadedSimulation.actionCount ?? null,
				gasUsed: decimalStringOrNull(loadedSimulation.gasUsed),
				resultPayloadHash: loadedSimulation.resultPayloadHash ?? null,
				error: loadedSimulation.error ?? null,
			},
			calls: loadedCalls.values
				.toSorted((left, right) => compareCallPaths(left.callPath, right.callPath))
				.map((call) => ({
					callPath: call.callPath,
					...(call.parentCallPath !== undefined && { parentCallPath: call.parentCallPath }),
					depth: call.depth,
					callIndex: call.callIndex,
					...(call.callType !== undefined && { callType: call.callType }),
					...(call.fromAddress !== undefined && { fromAddress: call.fromAddress }),
					...(call.toAddress !== undefined && { toAddress: call.toAddress }),
					...(call.value !== undefined && { value: call.value.toString() }),
					...(call.inputSelector !== undefined && { inputSelector: call.inputSelector }),
					...(call.inputDataHash !== undefined && { inputDataHash: call.inputDataHash }),
					...(call.outputDataHash !== undefined && { outputDataHash: call.outputDataHash }),
					...(call.gasUsed !== undefined && { gasUsed: call.gasUsed.toString() }),
					...(call.reverted !== undefined && { reverted: call.reverted }),
					...(call.error !== undefined && { error: call.error }),
				})),
			logs: loadedLogs.values
				.toSorted((left, right) => left.logIndex - right.logIndex)
				.map((log) => ({
					logIndex: log.logIndex,
					...(log.callPath !== undefined && { callPath: log.callPath }),
					...(log.address !== undefined && { address: log.address }),
					...(log.topic0 !== undefined && { topic0: log.topic0 }),
					topics: log.topics,
					...(log.dataHash !== undefined && { dataHash: log.dataHash }),
					...(log.decodedEventName !== undefined && { decodedEventName: log.decodedEventName }),
					...(log.decodedArgs !== undefined && { decodedArgs: log.decodedArgs }),
					...(log.removed !== undefined && { removed: log.removed }),
				})),
		}, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}\n`
		const objectUrl = URL.createObjectURL(new Blob([content], {
			type: 'application/json;charset=utf-8',
		}))
		const anchor = document.createElement('a')
		anchor.href = objectUrl
		anchor.download = 'blockhead-session-simulation.json'
		anchor.click()
		URL.revokeObjectURL(objectUrl)
	}


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary resource={simulation}>
	{#snippet children(loadedSimulation)}
		<ResourceBoundary resource={session}>
			{#snippet children(loadedSession)}
				<ResourceBoundary resource={calls}>
					{#snippet children(loadedCalls)}
						<ResourceBoundary resource={callCount}>
							{#snippet children(loadedCallCount)}
								<ResourceBoundary resource={logs}>
									{#snippet children(loadedLogs)}
										<ResourceBoundary resource={logCount}>
											{#snippet children(loadedLogCount)}
												{@const complete = loadedCalls.values.length === loadedCallCount && loadedLogs.values.length === loadedLogCount}
												<button
													type="button"
													disabled={!complete}
													onclick={() => downloadSimulation(
														loadedSimulation,
														loadedSession,
														loadedCalls,
														loadedLogs
													)}
												>
													Download JSON
												</button>
												{#if !complete}
													<span data-text="muted">
														Download unavailable until every persisted call and log is loaded.
													</span>
												{/if}
											{/snippet}
										</ResourceBoundary>
									{/snippet}
								</ResourceBoundary>
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</ResourceBoundary>
