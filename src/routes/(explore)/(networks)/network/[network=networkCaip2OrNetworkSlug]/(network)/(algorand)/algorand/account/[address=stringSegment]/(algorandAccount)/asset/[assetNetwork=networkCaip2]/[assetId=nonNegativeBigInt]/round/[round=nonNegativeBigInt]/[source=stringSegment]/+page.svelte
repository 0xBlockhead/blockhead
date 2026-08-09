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


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAssetHolding_RoundView from '$/views/AlgorandAssetHolding_RoundView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'algorand asset holding round'} • algorand asset holding round • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandAssetHolding_RoundView
		selection={
			select(EntityType.AlgorandAssetHolding_Round, {
				$account: data.selector,
				$asset: {
					$network: {
						$network: {
							caip2: params.assetNetwork,
						},
					},
					assetId: BigInt(params.assetId),
				},
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
