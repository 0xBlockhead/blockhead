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

	const pageSelection = $derived(select(EntityType.BlockheadCodexStorageNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.peerId || 'blockhead codex storage node state')} • blockhead codex storage node state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCodexStorageNodeStateView
		selection={pageSelection}
	/>
</Page>
