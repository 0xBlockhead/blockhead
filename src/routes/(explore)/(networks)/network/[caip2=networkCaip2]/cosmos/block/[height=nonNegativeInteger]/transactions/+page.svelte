<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosTransactionsView from '$/views/CosmosTransactionsView.svelte'
</script>


<svelte:head>
	<title>Cosmos block transactions • Blockhead</title>
</svelte:head>


<Page>
	<CosmosTransactionsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]/transactions', {
				caip2: params.caip2,
				height: params.height,
			})
		}
		title='Cosmos block transactions'
		selection={
			select(EntityType.CosmosBlock, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				height: BigInt(params.height),
			}).$$transactions
		}
		id='transactions'
	/>
</Page>
