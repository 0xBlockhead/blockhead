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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonTransaction, {
		$account: data.selector.$account,
		lt: BigInt(params.lt),
		hash: params.hash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON transaction'} • TON transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON transaction'} • TON transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
