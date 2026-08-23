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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonJetton, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TonJettonView from '$/views/TonJettonView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON jetton'} • TON jetton • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON jetton'} • TON jetton • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonJettonView
		selection={pageSelection}
	/>
	{/if}
</Page>
