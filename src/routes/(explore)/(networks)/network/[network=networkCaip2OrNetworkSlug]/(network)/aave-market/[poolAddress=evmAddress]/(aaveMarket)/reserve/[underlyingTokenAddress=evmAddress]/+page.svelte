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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AaveReserveView from '$/views/AaveReserveView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AaveReserve, {
					$market: data.selector,
					underlyingTokenAddress: params.underlyingTokenAddress,
				}, {
					sources: [
						Source.Aave_Rest,
					],
					fields: {
						symbol: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Aave reserve' : pageSelection.entity.symbol || 'Aave reserve')} • Aave reserve • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Aave reserve'} • Aave reserve • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AaveReserve, {
					$market: data.selector,
					underlyingTokenAddress: params.underlyingTokenAddress,
				}, {
					sources: [
						Source.Aave_Rest,
					],
					fields: {
						symbol: true,
					},
				}))}

		<AaveReserveView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
