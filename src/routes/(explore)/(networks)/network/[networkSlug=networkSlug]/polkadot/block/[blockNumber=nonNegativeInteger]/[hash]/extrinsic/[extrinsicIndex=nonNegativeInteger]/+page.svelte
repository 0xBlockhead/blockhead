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
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


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
			select(EntityType.PolkadotExtrinsic, {
				$block: {
					$network: {
						slug: params.networkSlug,
					},
					blockNumber: BigInt(params.blockNumber),
					hash: decodeURIComponent(params.hash),
				},
				indexInBlock: Number(params.extrinsicIndex),
			}, {
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
