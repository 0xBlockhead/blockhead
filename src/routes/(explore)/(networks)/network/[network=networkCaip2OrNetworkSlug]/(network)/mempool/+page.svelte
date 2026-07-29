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
	import EvmNetwork_Txpool_TimestampsView from '$/views/EvmNetwork_Txpool_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Mempool • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_Txpool_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool',
				{
					network: params.network,
				}
			)
		}
		title='Mempool'
		selection={select(EntityType.Network, data.selector).Evm.$$txpoolTimestamps}
		id='txpool-timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
