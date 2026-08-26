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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BittensorSubnet, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Bittensor_JsonRpc,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.netuid ?? '') || 'Bittensor subnet' : [(pageSelection.entity.name ?? ''), String(pageSelection.entitySelector.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet')} • Bittensor subnet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bittensor subnet'} • Bittensor subnet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BittensorSubnetView
		selection={pageSelection}
	/>
	{/if}
</Page>
