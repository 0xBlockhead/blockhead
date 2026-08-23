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
					blockNumber: BigInt(params.blockNumber),
				}, {
					fields: {
						blockHash: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.blockNumber ?? '') || 'avail block' : String(pageSelection.entitySelector.blockNumber) || pageSelection.entity.blockHash || 'avail block')} • avail block • Blockhead</title>
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
					blockNumber: BigInt(params.blockNumber),
				}, {
					fields: {
						blockHash: true,
					},
				}))}

		<AvailBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
