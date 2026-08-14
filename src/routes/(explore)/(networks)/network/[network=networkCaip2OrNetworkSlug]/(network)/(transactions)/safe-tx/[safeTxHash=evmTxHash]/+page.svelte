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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SafeMultisigTransaction, data.selector, {
		sources: [
			Source.SafeTransactionService_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SafeMultisigTransactionView from '$/views/SafeMultisigTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.safeTxHash || 'Safe transaction')} • Safe transaction • Blockhead</title>
</svelte:head>


<Page>
	<SafeMultisigTransactionView
		selection={pageSelection}
	/>
</Page>
