<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvailBlock, {
					$network: data.selector,
					blockHash: params.blockHash,
				}, {
					fields: {
						blockNumber: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.blockHash ?? '') || 'avail block' : String(pageSelection.entity.blockNumber) || pageSelection.entitySelector.blockHash || 'avail block')} • avail block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'avail block'} • avail block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvailBlock, {
					$network: data.selector,
					blockHash: params.blockHash,
				}, {
					fields: {
						blockNumber: true,
					},
				}))}

		<AvailBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
