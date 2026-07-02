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
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<svelte:head>
	<title>liquidity position • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPositionView
		href={
			resolve('/(assets)/position/[positionId]', {
				positionId: params.positionId,
			})
		}
		selection={
			select(EntityType.LiquidityPosition, data.selector, {
				fields: {
					$pool: true,
					tickLower: true,
					tickUpper: true,
					tokenId: true,
					origin: true,
					createdAtTimestamp: true,
				},
			})
		}
	/>
</Page>
