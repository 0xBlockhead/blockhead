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
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<svelte:head>
	<title>liquidity pool • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolView
		href={
			resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
				chainId: params.chainId,
				poolId: params.poolId,
			})
		}
		selection={
			select(EntityType.LiquidityPool, data.selector, {
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
