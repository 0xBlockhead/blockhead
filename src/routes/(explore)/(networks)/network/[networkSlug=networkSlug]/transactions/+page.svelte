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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<svelte:head>
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<UtxoTransactionsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions', {
				networkSlug: params.networkSlug,
			})
		}
		title='Transactions'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Utxo.$$transactions({
				sources: [
					Source.Blockscout_Rest,
				],
			})
		}
		id='transactions'
	/>
</Page>
