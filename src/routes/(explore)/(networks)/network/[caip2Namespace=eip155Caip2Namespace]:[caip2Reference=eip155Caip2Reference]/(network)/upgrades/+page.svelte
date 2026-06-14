<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

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
			selector: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$upgrades',
		}}
		id="upgrades"
	/>
</Page>
