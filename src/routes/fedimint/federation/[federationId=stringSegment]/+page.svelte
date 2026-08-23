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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FedimintFederation, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.federationId ?? '') || 'Fedimint federation' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.federationId || 'Fedimint federation')} • Fedimint federation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Fedimint federation'} • Fedimint federation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FedimintFederationView
		selection={pageSelection}
	/>
	{/if}
</Page>
