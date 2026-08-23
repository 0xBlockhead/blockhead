<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadRadicleNodeState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead radicle node state')} • blockhead radicle node state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead radicle node state'} • blockhead radicle node state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadRadicleNodeState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadRadicleNodeStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
