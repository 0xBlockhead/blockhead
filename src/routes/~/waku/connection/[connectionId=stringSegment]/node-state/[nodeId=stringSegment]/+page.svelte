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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadWakuNodeState, data.selector, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead waku node state')} • blockhead waku node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead waku node state'} • blockhead waku node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadWakuNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
