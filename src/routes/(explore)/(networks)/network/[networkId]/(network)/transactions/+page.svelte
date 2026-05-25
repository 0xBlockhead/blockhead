<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<Page>
	<EvmTransactionsView
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/transactions',
			{
				networkId: String(params.networkId),
			},
		)}
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$transactions',
		}}
		id="transactions"
	/>
</Page>

