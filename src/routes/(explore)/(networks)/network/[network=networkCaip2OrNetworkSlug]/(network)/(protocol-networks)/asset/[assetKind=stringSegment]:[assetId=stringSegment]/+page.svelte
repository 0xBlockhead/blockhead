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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PolkadotAsset, data.selector, {
		sources: [
			Source.SubstrateSidecar_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.assetId || 'Polkadot asset')} • Polkadot asset • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAssetView
		selection={pageSelection}
	/>
</Page>
