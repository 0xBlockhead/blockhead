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
			selector: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			fieldName: '$$upgrades',
		}}
		id="upgrades"
	/>
</Page>
