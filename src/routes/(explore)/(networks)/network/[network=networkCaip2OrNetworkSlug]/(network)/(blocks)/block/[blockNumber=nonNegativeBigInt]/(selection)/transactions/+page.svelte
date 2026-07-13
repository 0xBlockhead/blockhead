<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<EvmTransactionsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/transactions', {
				network: params.network,
				blockNumber: params.blockNumber,
			})
		}
		title='Block transactions'
		selection={select(EntityType.EvmBlock, data.selector).$$transactions}
		id='transactions'
	/>
</Page>
