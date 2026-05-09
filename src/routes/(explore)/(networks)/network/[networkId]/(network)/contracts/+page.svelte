<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<EvmContractsView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$contracts',
		}}
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', params)}
		id="contracts"
	/>
</Page>

