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

	const pageSelection = $derived(select(EntityType.HederaTransaction, data.selector, {
		fields: {
			transactionType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.transactionId ?? '') || 'hedera transaction' : pageSelection.entity.transactionType || pageSelection.entitySelector.transactionId || 'hedera transaction')} • hedera transaction • Blockhead</title>
</svelte:head>


<Page>
	<HederaTransactionView
		selection={pageSelection}
	/>
</Page>
