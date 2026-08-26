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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvalancheSubnet, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.subnetId ?? '') || 'avalanche subnet' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.subnetId || 'avalanche subnet')} • avalanche subnet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avalanche subnet'} • avalanche subnet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AvalancheSubnetView
		selection={pageSelection}
	/>
	{/if}
</Page>
