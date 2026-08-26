<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<EvmTransactionsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transactions',
				{
					network: params.network,
				}
			)
		}
		title='Transactions'
		selection={select(EntityType.Network, data.selector).Evm.$$transactions}
		id='transactions'
	/>
</Page>
