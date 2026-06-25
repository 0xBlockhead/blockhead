<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<Page>
	<BlockheadSessionSimulationView
		selection={select(EntityType.BlockheadSessionSimulation, data.selector)}
	/>
</Page>
