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
	import BnbBeaconTransactionView from '$/views/BnbBeaconTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconTransaction, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'bnb beacon transaction')} • bnb beacon transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bnb beacon transaction'} • bnb beacon transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconTransaction, data.selector))}

		<BnbBeaconTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
