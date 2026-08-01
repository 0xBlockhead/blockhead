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
	import XrplTransactionView from '$/views/XrplTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'XRPL transaction'} • XRPL transaction • Blockhead</title>
</svelte:head>


<Page>
	<XrplTransactionView
		selection={
			select(EntityType.XrplTransaction, data.selector, {
				fields: {
					transactionType: true,
					account: true,
					sequence: true,
				},
			})
		}
	/>
</Page>
