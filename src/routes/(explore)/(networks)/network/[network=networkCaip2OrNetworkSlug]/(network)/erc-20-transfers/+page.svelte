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
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
</script>


<svelte:head>
	<title>ERC-20 transfers • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenTransfersView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-20-transfers',
				{
					network: params.network,
				}
			)
		}
		title='ERC-20 transfers'
		selection={select(EntityType.Network, data.selector).Evm.$$erc20TokenTransfers}
		id='erc20-token-transfers'
	/>
</Page>
