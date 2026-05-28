<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


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
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { chainId: evmChainIdFromCaip2RouteParams(params) },
			fieldName: '$$upgrades',
		}}
		id="upgrades"
	/>
</Page>
