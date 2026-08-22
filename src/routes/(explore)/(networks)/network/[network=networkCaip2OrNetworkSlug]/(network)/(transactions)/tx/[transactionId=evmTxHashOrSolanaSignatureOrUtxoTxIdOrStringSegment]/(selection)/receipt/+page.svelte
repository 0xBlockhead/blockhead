<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TronTransactionReceiptView from '$/views/TronTransactionReceiptView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tron transaction receipt'} • tron transaction receipt • Blockhead</title>
</svelte:head>


<Page>
	<TronTransactionReceiptView
		selection={
			select(EntityType.TronTransactionReceipt, {
				$transaction: data.selector,
			})
		}
	/>
</Page>
