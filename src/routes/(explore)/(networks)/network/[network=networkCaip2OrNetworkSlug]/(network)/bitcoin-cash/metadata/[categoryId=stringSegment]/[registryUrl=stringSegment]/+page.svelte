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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinCashBcmrMetadata, {
		$network: data.selector,
		categoryId: params.categoryId,
		registryUrl: params.registryUrl,
	}, {
		sources: [
			Source.BitcoinCashBcmr_Github,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashBcmrMetadataView from '$/views/BitcoinCashBcmrMetadataView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.categoryId ?? '') || 'Bitcoin cash bcmr metadata' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.categoryId || 'Bitcoin cash bcmr metadata')} • Bitcoin cash bcmr metadata • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin cash bcmr metadata'} • Bitcoin cash bcmr metadata • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinCashBcmrMetadataView
		selection={pageSelection}
	/>
	{/if}
</Page>
