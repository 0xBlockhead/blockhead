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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadAvalancheNodeState, data.selector, {
		sources: [
			Source.AvalancheInfo_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAvalancheNodeStateView from '$/views/BlockheadAvalancheNodeStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead avalanche node state')} • blockhead avalanche node state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead avalanche node state'} • blockhead avalanche node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadAvalancheNodeStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
