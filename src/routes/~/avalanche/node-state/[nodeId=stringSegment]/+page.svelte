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

	const pageSelection = $derived(select(EntityType.BlockheadAvalancheNodeState, data.selector, {
		sources: [
			Source.AvalancheInfo_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead avalanche node state')} • blockhead avalanche node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAvalancheNodeStateView
		selection={pageSelection}
	/>
</Page>
