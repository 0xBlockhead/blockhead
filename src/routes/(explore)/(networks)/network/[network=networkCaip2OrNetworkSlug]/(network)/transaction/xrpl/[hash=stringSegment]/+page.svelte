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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplTransactionView from '$/views/XrplTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL transaction'} • XRPL transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL transaction'} • XRPL transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
