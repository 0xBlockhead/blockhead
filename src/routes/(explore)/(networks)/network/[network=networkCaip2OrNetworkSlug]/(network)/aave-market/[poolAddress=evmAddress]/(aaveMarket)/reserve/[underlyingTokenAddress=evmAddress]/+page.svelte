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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AaveReserve, {
		$market: data.selector,
		underlyingTokenAddress: params.underlyingTokenAddress,
	}, {
		sources: [
			Source.Aave_Rest,
		],
		fields: {
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AaveReserveView from '$/views/AaveReserveView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Aave reserve' : pageSelection.entity.symbol || 'Aave reserve')} • Aave reserve • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Aave reserve'} • Aave reserve • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AaveReserveView
		selection={pageSelection}
	/>
	{/if}
</Page>
