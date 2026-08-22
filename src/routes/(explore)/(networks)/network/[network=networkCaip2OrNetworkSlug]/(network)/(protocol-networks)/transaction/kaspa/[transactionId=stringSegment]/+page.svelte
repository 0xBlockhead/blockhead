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
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'kaspa transaction'} • kaspa transaction • Blockhead</title>
</svelte:head>


<Page>
	<KaspaTransactionView
		selection={
			select(EntityType.KaspaTransaction, {
				$network: data.selector,
				transactionId: params.transactionId,
			}, {
				sources: [
					Source.KaspaExplorer,
					Source.KaspaNode_Grpc,
					Source.KaspaNode_Rest,
					Source.KaspaNode_Wrpc,
				],
			})
		}
	/>
</Page>
