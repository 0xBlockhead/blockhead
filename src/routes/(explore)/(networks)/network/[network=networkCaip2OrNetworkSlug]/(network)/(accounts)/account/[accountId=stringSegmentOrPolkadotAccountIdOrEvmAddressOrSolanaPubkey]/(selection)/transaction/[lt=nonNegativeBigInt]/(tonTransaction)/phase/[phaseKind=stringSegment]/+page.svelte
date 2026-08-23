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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TonTransactionPhaseView from '$/views/TonTransactionPhaseView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonTransactionPhase, {
					$transaction: data.selector,
					phaseKind: params.phaseKind,
				}))}
			<title>{data?.title ?? 'TON transaction phase'} • TON transaction phase • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'TON transaction phase'} • TON transaction phase • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonTransactionPhase, {
					$transaction: data.selector,
					phaseKind: params.phaseKind,
				}))}

		<TonTransactionPhaseView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
