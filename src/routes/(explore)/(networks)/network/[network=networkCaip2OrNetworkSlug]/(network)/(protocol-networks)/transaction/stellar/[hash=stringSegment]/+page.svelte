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
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarTransaction, data.selector)}
		<title>{data?.title ?? 'stellar transaction'} • stellar transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar transaction'} • stellar transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarTransaction, data.selector)}

	<StellarTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
