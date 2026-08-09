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

	const pageSelection = $derived(select(EntityType.ZeroGDaQuorum, data.selector, {
		sources: [
			Source.ZeroGChainScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.quorumId || 'zero g da quorum')} • zero g da quorum • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGDaQuorumView
		selection={pageSelection}
	/>
</Page>
