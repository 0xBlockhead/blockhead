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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Coin, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Coin' : [pageSelection.entity.symbol, pageSelection.entity.name].filter(Boolean).join(' ') || 'Coin')} • Coin • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Coin'} • Coin • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CoinView
		selection={pageSelection}
	/>
	{/if}
</Page>
