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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ZeroGConsensusNetwork, data.selector, {
		sources: [
			Source.ZeroGChainScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.consensusNetworkId || 'zero g consensus network')} • zero g consensus network • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGConsensusNetworkView
		selection={pageSelection}
	/>
</Page>
