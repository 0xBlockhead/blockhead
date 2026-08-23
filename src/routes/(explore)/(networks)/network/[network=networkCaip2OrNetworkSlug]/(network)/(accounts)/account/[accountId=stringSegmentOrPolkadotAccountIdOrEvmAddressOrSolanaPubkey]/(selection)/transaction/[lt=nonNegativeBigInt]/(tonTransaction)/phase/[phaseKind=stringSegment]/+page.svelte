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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonTransactionPhase, {
		$transaction: data.selector,
		phaseKind: params.phaseKind,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonTransactionPhaseView from '$/views/TonTransactionPhaseView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON transaction phase'} • TON transaction phase • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON transaction phase'} • TON transaction phase • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonTransactionPhaseView
		selection={pageSelection}
	/>
	{/if}
</Page>
