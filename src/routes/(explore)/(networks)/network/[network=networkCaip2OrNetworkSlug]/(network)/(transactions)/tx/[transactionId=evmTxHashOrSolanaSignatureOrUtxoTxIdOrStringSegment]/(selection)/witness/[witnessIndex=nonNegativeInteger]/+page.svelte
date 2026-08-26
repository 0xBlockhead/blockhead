<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoScriptWitness, {
		$transaction: data.selector,
		witnessIndex: Number(params.witnessIndex),
	}, {
		fields: {
			scriptKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoScriptWitnessView from '$/views/CardanoScriptWitnessView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Script #' + String(pageSelection.entitySelector.witnessIndex ?? '') : [pageSelection.entity.scriptKind, 'Script #' + String(pageSelection.entitySelector.witnessIndex)].filter(Boolean).join(' ') || 'Cardano script witness')} • Cardano script witness • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano script witness'} • Cardano script witness • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoScriptWitnessView
		selection={pageSelection}
	/>
	{/if}
</Page>
