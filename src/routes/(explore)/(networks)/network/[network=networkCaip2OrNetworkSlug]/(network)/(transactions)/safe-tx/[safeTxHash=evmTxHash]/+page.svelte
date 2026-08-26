<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SafeMultisigTransaction, data.selector, {
		sources: [
			Source.SafeTransactionService_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SafeMultisigTransactionView from '$/views/SafeMultisigTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.safeTxHash || 'Safe transaction')} • Safe transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Safe transaction'} • Safe transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SafeMultisigTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
