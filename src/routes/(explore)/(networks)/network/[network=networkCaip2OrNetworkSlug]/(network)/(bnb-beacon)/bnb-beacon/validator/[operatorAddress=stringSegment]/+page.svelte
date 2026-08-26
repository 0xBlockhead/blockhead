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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BnbValidator, data.selector, {
		fields: {
			moniker: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbValidatorView from '$/views/BnbValidatorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.operatorAddress ?? '') || 'bnb validator' : (pageSelection.entity.moniker ?? '') || pageSelection.entitySelector.operatorAddress || 'bnb validator')} • bnb validator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bnb validator'} • bnb validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BnbValidatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
