<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SafeMultisigTransactionView from '$/views/SafeMultisigTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SafeMultisigTransaction, data.selector, {
					sources: [
						Source.SafeTransactionService_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.safeTxHash || 'Safe transaction')} • Safe transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Safe transaction'} • Safe transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SafeMultisigTransaction, data.selector, {
					sources: [
						Source.SafeTransactionService_Rest,
					],
				}))}

		<SafeMultisigTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
