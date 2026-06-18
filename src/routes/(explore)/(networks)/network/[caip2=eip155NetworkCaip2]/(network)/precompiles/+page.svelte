<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
</script>


<Page>
	<EvmPrecompilesView
		selection={select(
			EntityType.EvmNetwork,
			eip155NetworkSelectorFromCaip2(params.caip2)
		).$$precompiles({
			sources: [
				Source.Constants_Internal,
			],
			limit: 64,
		})}
		id="precompiles"
	/>
</Page>
