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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadRadiclePeer, {
		$node: data.selector,
		peerNodeId: params.peerNodeId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadiclePeerView from '$/views/BlockheadRadiclePeerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.peerNodeId || 'blockhead radicle peer')} • blockhead radicle peer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle peer'} • blockhead radicle peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadRadiclePeerView
		selection={pageSelection}
	/>
	{/if}
</Page>
