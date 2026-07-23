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
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.poolId) ?? '')].filter(Boolean).join(' ') || 'Cardano stake pool' : [String((({ ...data.selector, ...pageSelection.entity }).ticker) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).poolId) ?? '')].filter(Boolean).join(' ') || 'Cardano stake pool'))} • Cardano stake pool • Blockhead</title>
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
