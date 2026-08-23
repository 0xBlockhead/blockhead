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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui transaction'} • Sui transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui transaction'} • Sui transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
