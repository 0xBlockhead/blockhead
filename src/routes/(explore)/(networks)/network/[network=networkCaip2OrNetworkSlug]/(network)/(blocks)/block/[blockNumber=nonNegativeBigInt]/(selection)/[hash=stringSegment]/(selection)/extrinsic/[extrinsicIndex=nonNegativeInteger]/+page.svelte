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

	const pageSelection = $derived(select(EntityType.PolkadotExtrinsic, {
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Extrinsic #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'Polkadot extrinsic')} • Polkadot extrinsic • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotExtrinsicView
		selection={pageSelection}
	/>
</Page>
