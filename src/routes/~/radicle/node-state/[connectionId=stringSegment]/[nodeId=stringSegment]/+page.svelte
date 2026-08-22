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

	const pageSelection = $derived(select(EntityType.BlockheadRadicleNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead radicle node state')} • blockhead radicle node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRadicleNodeStateView
		selection={pageSelection}
	/>
</Page>
