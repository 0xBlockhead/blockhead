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
	import TonJettonView from '$/views/TonJettonView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonJetton, data.selector)}
		<title>{data?.title ?? 'TON jetton'} • TON jetton • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON jetton'} • TON jetton • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonJetton, data.selector)}

	<TonJettonView
		selection={pageSelection}
	/>
	{/if}
</Page>
