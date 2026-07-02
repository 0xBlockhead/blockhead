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
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	<title>Polkadot extrinsic • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotExtrinsicView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				blockNumber: params.blockNumber,
				hash: params.hash,
				extrinsicIndex: params.extrinsicIndex,
			})
		}
		selection={
			select(EntityType.PolkadotExtrinsic, data.selector, {
				fields: {
					callName: true,
					success: true,
					hash: true,
					$signer: true,
					$pallet: true,
				},
			})
		}
	/>
</Page>
