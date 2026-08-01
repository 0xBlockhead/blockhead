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

	const pageSelection = $derived(select(EntityType.PolkadotPallet, data.selector, {
		fields: {
			index: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.palletName || 'Polkadot pallet')} • Polkadot pallet • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotPalletView
		selection={pageSelection}
	/>
</Page>
