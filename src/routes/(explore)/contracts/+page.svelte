<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<EvmContractsView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: 1 },
			fieldName: '$$evmContracts',
		}}
		href={resolve('/contracts')}
		id="contracts"
	/>
</Page>
