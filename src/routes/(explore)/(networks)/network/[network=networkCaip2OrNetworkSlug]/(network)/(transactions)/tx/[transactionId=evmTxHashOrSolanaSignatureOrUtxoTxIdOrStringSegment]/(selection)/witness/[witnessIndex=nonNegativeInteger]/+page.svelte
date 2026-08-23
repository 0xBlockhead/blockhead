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
	import CardanoScriptWitnessView from '$/views/CardanoScriptWitnessView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoScriptWitness, {
					$transaction: data.selector,
					witnessIndex: Number(params.witnessIndex),
				}, {
					fields: {
						scriptKind: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Script #' + String(pageSelection.entitySelector.witnessIndex ?? '') : [pageSelection.entity.scriptKind, 'Script #' + String(pageSelection.entitySelector.witnessIndex)].filter(Boolean).join(' ') || 'Cardano script witness')} • Cardano script witness • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano script witness'} • Cardano script witness • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoScriptWitness, {
					$transaction: data.selector,
					witnessIndex: Number(params.witnessIndex),
				}, {
					fields: {
						scriptKind: true,
					},
				}))}

		<CardanoScriptWitnessView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
