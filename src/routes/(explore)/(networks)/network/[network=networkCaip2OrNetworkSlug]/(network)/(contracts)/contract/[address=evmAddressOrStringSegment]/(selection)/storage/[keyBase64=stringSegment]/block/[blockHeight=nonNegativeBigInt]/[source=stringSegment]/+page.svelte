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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NearContractStorageEntryView from '$/views/NearContractStorageEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearContractStorageEntry, {
				$contract: data.selector,
				keyBase64: params.keyBase64,
				blockHeight: BigInt(params.blockHeight),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.keyBase64 || 'near contract storage entry')} • near contract storage entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near contract storage entry'} • near contract storage entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearContractStorageEntry, {
				$contract: data.selector,
				keyBase64: params.keyBase64,
				blockHeight: BigInt(params.blockHeight),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<NearContractStorageEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
