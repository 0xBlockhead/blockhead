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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCodexStorageNodeState, data.selector, {
		sources: [
			Source.CodexNode_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.peerId || 'blockhead codex storage node state')} • blockhead codex storage node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead codex storage node state'} • blockhead codex storage node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadCodexStorageNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
