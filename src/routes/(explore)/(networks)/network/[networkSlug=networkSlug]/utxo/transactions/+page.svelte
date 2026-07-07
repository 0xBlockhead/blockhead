<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<svelte:head>
	<title>UTXO transactions • Blockhead</title>
</svelte:head>


<Page>
	<UtxoTransactionsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/transactions', {
				networkSlug: params.networkSlug,
			})
		}
		title='UTXO transactions'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			})[EntityProxyField]<EntityType.UtxoTransaction>('$$utxoTransactions', {
				sources: [
					Source.MempoolSpace_Rest,
					Source.Blockchair_Rest,
					Source.Zcashd_JsonRpc,
				],
			})
		}
		id='utxo-transactions'
	/>
</Page>
