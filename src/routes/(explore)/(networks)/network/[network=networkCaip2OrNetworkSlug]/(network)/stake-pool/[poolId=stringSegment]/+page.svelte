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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoStakePool, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			ticker: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.poolId ?? '') || 'Cardano stake pool' : [(pageSelection.entity.ticker ?? ''), pageSelection.entitySelector.poolId].filter(Boolean).join(' ') || 'Cardano stake pool')} • Cardano stake pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano stake pool'} • Cardano stake pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoStakePoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
