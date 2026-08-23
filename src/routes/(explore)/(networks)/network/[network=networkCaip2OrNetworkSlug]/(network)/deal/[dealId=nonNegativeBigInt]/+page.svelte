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
	import FilecoinDealView from '$/views/FilecoinDealView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinDeal, data.selector, {
					sources: [
						Source.Filfox_Rest,
						Source.Lotus_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.dealId) || 'filecoin deal')} • filecoin deal • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'filecoin deal'} • filecoin deal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinDeal, data.selector, {
					sources: [
						Source.Filfox_Rest,
						Source.Lotus_JsonRpc,
					],
				}))}

		<FilecoinDealView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
