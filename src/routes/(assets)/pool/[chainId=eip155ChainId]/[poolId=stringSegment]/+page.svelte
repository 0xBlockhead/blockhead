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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LiquidityPool, data.selector, {
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'liquidity pool' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'liquidity pool')))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • liquidity pool • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolView
		href={
			resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
				chainId: params.chainId,
				poolId: params.poolId,
			})
		}
		selection={pageSelection}
	/>
</Page>
