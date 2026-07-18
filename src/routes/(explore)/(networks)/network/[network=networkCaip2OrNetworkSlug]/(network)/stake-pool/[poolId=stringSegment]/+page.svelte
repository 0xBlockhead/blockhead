<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CardanoStakePool, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			vrfKeyHash: true,
			name: true,
			ticker: true,
			description: true,
			homepage: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.poolId) ?? '')].filter(Boolean).join(' ') || 'Cardano stake pool' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).poolId) ?? '')].filter(Boolean).join(' ') || 'Cardano stake pool')))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Cardano stake pool • Blockhead</title>
</svelte:head>


<Page>
	<CardanoStakePoolView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
				network: params.network,
				poolId: params.poolId,
			})
		}
		selection={pageSelection}
	/>
</Page>
