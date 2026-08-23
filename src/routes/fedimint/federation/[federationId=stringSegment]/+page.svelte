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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FedimintFederation, data.selector, {
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.federationId ?? '') || 'Fedimint federation' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.federationId || 'Fedimint federation')} • Fedimint federation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Fedimint federation'} • Fedimint federation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FedimintFederation, data.selector, {
					fields: {
						name: true,
					},
				}))}

		<FedimintFederationView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
