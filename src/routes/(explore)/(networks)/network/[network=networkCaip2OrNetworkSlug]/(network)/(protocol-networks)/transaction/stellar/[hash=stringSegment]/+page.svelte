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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar transaction'} • stellar transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar transaction'} • stellar transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
