<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/contracts',
			{
				networkId: '1',
			},
		)}
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: 1 },
			fieldName: '$$contracts',
		}}
		id="contracts"
	/>
</Page>
