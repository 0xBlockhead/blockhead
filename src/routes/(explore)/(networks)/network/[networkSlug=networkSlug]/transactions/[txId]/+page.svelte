<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Transaction • Blockhead</title>
</svelte:head>


<Page>
	<UtxoTransactionView
		selection={select(EntityType.UtxoTransaction, {
			$network: { slug: params.networkSlug },
			txId: params.txId,
		})}
		open={true}
	/>
</Page>
