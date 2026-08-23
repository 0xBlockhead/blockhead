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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AptosTableItem, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.keyHash || 'aptos table item')} • aptos table item • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos table item'} • aptos table item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AptosTableItemView
		selection={pageSelection}
	/>
	{/if}
</Page>
