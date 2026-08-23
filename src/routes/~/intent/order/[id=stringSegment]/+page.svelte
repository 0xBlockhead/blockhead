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
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadIntentOrder, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						orderId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent order' : pageSelection.entity.orderId || 'blockhead intent order')} • blockhead intent order • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead intent order'} • blockhead intent order • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadIntentOrder, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						orderId: true,
					},
				}))}

		<BlockheadIntentOrderView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
