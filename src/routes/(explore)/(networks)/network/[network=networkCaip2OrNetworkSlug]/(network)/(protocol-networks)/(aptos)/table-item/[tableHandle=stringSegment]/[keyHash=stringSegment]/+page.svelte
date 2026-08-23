<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosTableItem, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.keyHash || 'aptos table item')} • aptos table item • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'aptos table item'} • aptos table item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosTableItem, data.selector))}

		<AptosTableItemView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
