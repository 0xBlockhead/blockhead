<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<Page>
	<LiquidityPositionView
		selection={select(EntityType.LiquidityPosition, {
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: params.positionId,
		})}
	/>
</Page>
