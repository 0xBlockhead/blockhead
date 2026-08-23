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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NearExecutionOutcomeView from '$/views/NearExecutionOutcomeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearExecutionOutcome, {
					$transaction: data.selector,
					outcomeId: params.outcomeId,
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.outcomeId || 'near execution outcome')} • near execution outcome • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near execution outcome'} • near execution outcome • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearExecutionOutcome, {
					$transaction: data.selector,
					outcomeId: params.outcomeId,
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}

		<NearExecutionOutcomeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
