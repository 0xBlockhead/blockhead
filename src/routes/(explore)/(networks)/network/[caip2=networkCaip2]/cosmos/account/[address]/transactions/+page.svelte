<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	<title>Cosmos account transactions • Blockhead</title>
</svelte:head>


<Page>
	<CosmosTransactionsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/transactions', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		title='Cosmos account transactions'
		selection={
			select(EntityType.CosmosAccount, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			})[EntityProxyField]<EntityType.CosmosTransaction>('$$transactions')
		}
		id='CosmosTransactionsView-page'
	/>
</Page>
