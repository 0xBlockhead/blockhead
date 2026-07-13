<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PolkadotPallet, data.selector, {
		fields: {
			index: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.palletName) ?? '')].filter(Boolean).join(' ') || 'Polkadot pallet' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).palletName) ?? '')].filter(Boolean).join(' ') || 'Polkadot pallet')))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Polkadot pallet • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotPalletView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
				network: params.network,
				palletName: params.palletName,
			})
		}
		selection={pageSelection}
	/>
</Page>
