<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitcoinCashBcmrMetadata, {
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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.categoryId ?? '') || 'Bitcoin cash bcmr metadata' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.categoryId || 'Bitcoin cash bcmr metadata')} • Bitcoin cash bcmr metadata • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashBcmrMetadataView
		selection={pageSelection}
	/>
</Page>
