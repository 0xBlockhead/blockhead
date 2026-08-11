<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaAcceptedTransactionView from '$/views/KaspaAcceptedTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'kaspa accepted transaction'} • kaspa accepted transaction • Blockhead</title>
</svelte:head>


<Page>
	<KaspaAcceptedTransactionView
		selection={
			select(EntityType.KaspaAcceptedTransaction, {
				$acceptingBlock: data.selector,
				$transaction: {
					$network: data.selector.$network,
					transactionId: params.transactionId,
				},
			}, {
				sources: [
					Source.KaspaNode_Grpc,
					Source.KaspaNode_Wrpc,
				],
			})
		}
	/>
</Page>
