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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BnbBeaconBlock, {
		$network: data.selector,
		hash: params.hash,
	}, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconBlockView from '$/views/BnbBeaconBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.hash ?? '') || 'bnb beacon block' : String(pageSelection.entity.height) || pageSelection.entitySelector.hash || 'bnb beacon block')} • bnb beacon block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bnb beacon block'} • bnb beacon block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BnbBeaconBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
