<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/contracts',
			{
				networkId: String(params.networkId),
			},
		)}
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$contracts',
		}}
		id="contracts"
	/>
</Page>

