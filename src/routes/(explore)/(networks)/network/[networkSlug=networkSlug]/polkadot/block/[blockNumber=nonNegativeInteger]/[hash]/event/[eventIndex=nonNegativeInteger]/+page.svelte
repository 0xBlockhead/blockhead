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
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


<Page>
	<PolkadotEventView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/event/[eventIndex=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				blockNumber: params.blockNumber,
				hash: params.hash,
				eventIndex: params.eventIndex,
			})
		}
		selection={
			select(EntityType.PolkadotEvent, {
				$block: {
					$network: {
						slug: params.networkSlug,
					},
					blockNumber: BigInt(params.blockNumber),
					hash: decodeURIComponent(params.hash),
				},
				indexInBlock: Number(params.eventIndex),
			}, {
				fields: {
					eventName: true,
					$pallet: true,
					$extrinsic: true,
				},
			})
		}
	/>
</Page>
