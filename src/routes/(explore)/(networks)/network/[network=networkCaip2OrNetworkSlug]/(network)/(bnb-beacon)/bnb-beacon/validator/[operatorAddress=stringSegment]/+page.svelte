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
	import BnbValidatorView from '$/views/BnbValidatorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbValidator, data.selector, {
				fields: {
					moniker: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.operatorAddress ?? '') || 'bnb validator' : (pageSelection.entity.moniker ?? '') || pageSelection.entitySelector.operatorAddress || 'bnb validator')} • bnb validator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bnb validator'} • bnb validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbValidator, data.selector, {
				fields: {
					moniker: true,
				},
			})}

	<BnbValidatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
