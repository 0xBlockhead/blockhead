<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
</script>


<svelte:head>
	<title>Fee market • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasFee_BlocksView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market',
				{
					network: params.network,
				}
			)
		}
		title='Fee market'
		selection={select(EntityType.Network, data.selector).Evm.$$gasFeeBlocks}
		id='gas-fee-blocks'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
