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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NearContractStorageEntry, {
		$contract: data.selector,
		keyBase64: params.keyBase64,
		blockHeight: BigInt(params.blockHeight),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearContractStorageEntryView from '$/views/NearContractStorageEntryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.keyBase64 || 'near contract storage entry')} • near contract storage entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near contract storage entry'} • near contract storage entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NearContractStorageEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
