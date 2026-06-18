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
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
</script>


<Page>
	<EvmBlobsView
		selection={select(
			EntityType.EvmNetwork,
			eip155NetworkSelectorFromCaip2(params.caip2)
		).$$blobs({
			sources: [
				Source.Voltaire_JsonRpc,
			],
			limit: 8,
		})}
		href={resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blobs',
			{
				caip2: params.caip2,
			}
		)}
		id="blobs"
	/>
</Page>
