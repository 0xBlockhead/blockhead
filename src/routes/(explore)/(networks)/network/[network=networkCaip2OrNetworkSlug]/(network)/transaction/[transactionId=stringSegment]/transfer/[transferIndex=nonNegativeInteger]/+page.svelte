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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TronTokenTransferView from '$/views/TronTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tron token transfer'} • tron token transfer • Blockhead</title>
</svelte:head>


<Page>
	<TronTokenTransferView
		selection={
			select(EntityType.TronTokenTransfer, {
				$network: data.selector,
				transactionId: params.transactionId,
				transferIndex: Number(params.transferIndex),
			})
		}
	/>
</Page>
