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

	const pageSelection = $derived(select(EntityType.BlockheadWakuNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.WakuNode,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWakuNodeStateView from '$/views/BlockheadWakuNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.nodeId || 'blockhead waku node state')} • blockhead waku node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWakuNodeStateView
		selection={pageSelection}
	/>
</Page>
