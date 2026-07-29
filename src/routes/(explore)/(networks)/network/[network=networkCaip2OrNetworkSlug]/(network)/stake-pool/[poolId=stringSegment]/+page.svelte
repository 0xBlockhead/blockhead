<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.CardanoStakePool, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			ticker: true,
			vrfKeyHash: true,
			name: true,
			description: true,
			homepage: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.poolId ?? '') || 'Cardano stake pool' : [(pageSelection.entity.ticker ?? ''), pageSelection.entitySelector.poolId].filter(Boolean).join(' ') || 'Cardano stake pool')} • Cardano stake pool • Blockhead</title>
</svelte:head>


<Page>
	<CardanoStakePoolView
		selection={pageSelection}
	/>
</Page>
