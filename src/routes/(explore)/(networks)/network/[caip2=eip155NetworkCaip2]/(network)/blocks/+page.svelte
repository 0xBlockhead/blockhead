<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<Page>
	<EvmBlocksView
		href={resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks',
			{
				caip2: params.caip2,
			}
		)}
		selection={select(
			EntityType.EvmNetwork,
			eip155NetworkSelectorFromCaip2(params.caip2)
		).$$blocks({
			sources: [
				Source.Voltaire_JsonRpc,
			],
			limit: 16,
			count: true,
		})}
		id="blocks"
	/>
</Page>
