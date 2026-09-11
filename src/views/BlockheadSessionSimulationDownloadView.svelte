<script lang="ts">
	import type { EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import BlockheadSessionSimulationDownload, {
		callsExportSelection,
		logsExportSelection,
		sessionExportSelection,
		simulationExportSelection,
	} from '$/views/BlockheadSessionSimulationDownload.svelte'

	let {
		selection,
	}: Pick<EntitySelectionViewProps<EntityType.BlockheadSessionSimulation>, 'selection'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const simulation = $derived(viewSelection(simulationExportSelection))
	const session = $derived(viewSelection.$session(sessionExportSelection))
	const calls = $derived(viewSelection.$$calls(callsExportSelection))
	const callCount = $derived(calls.count(sessionExportSelection))
	const logs = $derived(viewSelection.$$logs(logsExportSelection))
	const logCount = $derived(logs.count(sessionExportSelection))
</script>


<BlockheadSessionSimulationDownload
	simulationId={selection.entitySelector.id}
	{simulation}
	{session}
	{calls}
	{callCount}
	{logs}
	{logCount}
/>
