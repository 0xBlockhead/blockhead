<!-- Generated from APP.ts. -->

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
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<svelte:head>
	<title>Block transactions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.EvmBlock, data.selector).$$transactions}

	<EvmTransactionsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions',
				{
					network: params.network,
					blockNumber: params.blockNumber,
				}
			)
		}
		title='Block transactions'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='transactions'
	/>
</Page>
