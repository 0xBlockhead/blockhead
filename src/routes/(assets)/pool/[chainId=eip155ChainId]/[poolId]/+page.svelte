<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<Page>
	<LiquidityPoolView
		href={
			resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
				chainId: params.chainId,
				poolId: params.poolId,
			})
		}
		selection={
			select(EntityType.LiquidityPool, {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				id: decodeURIComponent(params.poolId),
			}, {
				sources: [
					Source.Dexscreener_OpenApi,
				],
				fields: {
					$baseToken: true,
					$quoteToken: true,
					$hooks: true,
					fee: true,
					tickSpacing: true,
					v4PoolId: true,
				},
			})
		}
	/>
</Page>
