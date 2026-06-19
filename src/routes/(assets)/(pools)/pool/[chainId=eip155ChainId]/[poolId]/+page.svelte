<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<Page>
	<LiquidityPoolView
		selection={select(EntityType.LiquidityPool, {
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: params.poolId,
		})}
	/>
</Page>
