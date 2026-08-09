<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSessionSimulationCall, {
		simulationId: params.simulationId,
		callPath: params.callPath,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionSimulationCallView from '$/views/BlockheadSessionSimulationCallView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.callPath || 'blockhead session simulation call'} • blockhead session simulation call • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionSimulationCallView
		selection={pageSelection}
	/>
</Page>
