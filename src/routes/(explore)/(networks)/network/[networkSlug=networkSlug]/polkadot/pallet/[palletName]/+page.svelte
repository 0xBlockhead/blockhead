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


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<svelte:head>
	<title>Polkadot pallet • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotPalletView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
				networkSlug: params.networkSlug,
				palletName: params.palletName,
			})
		}
		selection={
			select(EntityType.PolkadotPallet, data.selector, {
				fields: {
					index: true,
				},
			})
		}
	/>
</Page>
