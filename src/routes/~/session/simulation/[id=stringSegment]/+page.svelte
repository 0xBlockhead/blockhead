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

	const pageSelection = $derived(select(EntityType.BlockheadSessionSimulation, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'blockhead session simulation' : pageSelection.entity.status || 'blockhead session simulation'} • blockhead session simulation • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionSimulationView
		selection={pageSelection}
	/>
</Page>
