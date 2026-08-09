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

	const pageSelection = $derived(select(EntityType.FedimintFederation, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.federationId ?? '') || 'Fedimint federation' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.federationId || 'Fedimint federation')} • Fedimint federation • Blockhead</title>
</svelte:head>


<Page>
	<FedimintFederationView
		selection={pageSelection}
	/>
</Page>
