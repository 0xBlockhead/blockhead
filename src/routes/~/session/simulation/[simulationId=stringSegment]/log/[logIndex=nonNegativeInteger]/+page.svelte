<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSessionSimulationLog, {
		simulationId: params.simulationId,
		logIndex: Number(params.logIndex),
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionSimulationLogView from '$/views/BlockheadSessionSimulationLogView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.logIndex) || 'blockhead session simulation log'} • blockhead session simulation log • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionSimulationLogView
		selection={pageSelection}
	/>
</Page>
