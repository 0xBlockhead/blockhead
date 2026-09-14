<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { parse } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolFeeSchedule_EvmBlockView from '$/views/LiquidityPoolFeeSchedule_EvmBlockView.svelte'
</script>


<svelte:head>
	<title>liquidity pool fee schedule block observation • liquidity pool fee schedule block observation • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolFeeSchedule_EvmBlockView
		selection={
			select(EntityType.LiquidityPoolFeeSchedule_EvmBlock, {
				$feeSchedule: {
					$pool: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: params.chainId,
							},
						},
						id: params.poolId,
					},
					feeType: params.feeType,
				},
				$block: parse(params.blockSelector),
				sourceRevision: params.sourceRevision,
			}, {
				sources: [
					Source.TheGraph_Graphql,
				],
			})
		}
	/>
</Page>
