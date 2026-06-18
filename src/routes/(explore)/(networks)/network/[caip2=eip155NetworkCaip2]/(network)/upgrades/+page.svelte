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
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EthereumNetworkUpgradesView
		selection={select(
			EntityType.EvmNetwork,
			eip155NetworkSelectorFromCaip2(params.caip2)
		).$$upgrades({
			sources: [
				Source.Constants_Internal,
			],
			limit: 512,
		})}
		id="upgrades"
	/>
</Page>
