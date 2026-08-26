<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoDRep, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			displayName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.drepCredential ?? '') || 'Cardano DRep' : [(pageSelection.entity.displayName ?? ''), pageSelection.entitySelector.drepCredential].filter(Boolean).join(' ') || 'Cardano DRep')} • Cardano DRep • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano DRep'} • Cardano DRep • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoDRepView
		selection={pageSelection}
	/>
	{/if}
</Page>
