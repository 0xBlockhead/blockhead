<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<Page>
		<EvmBlockView
			selection={select(EntityType.EvmBlock, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			blockNumber: BigInt(params.blockNumber),
		})}
	/>
</Page>
