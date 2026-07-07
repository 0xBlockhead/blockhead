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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<Page>
	<PolkadotPalletView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
				networkSlug: params.networkSlug,
				palletName: params.palletName,
			})
		}
		selection={
			select(EntityType.PolkadotPallet, {
				$network: {
					slug: params.networkSlug,
				},
				palletName: decodeURIComponent(params.palletName),
			}, {
				fields: {
					index: true,
				},
			})
		}
	/>
</Page>
