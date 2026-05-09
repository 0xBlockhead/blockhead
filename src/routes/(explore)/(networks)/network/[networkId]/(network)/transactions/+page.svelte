<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<EvmTransactionsView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$transactions',
		}}
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', params)}
		id="transactions"
	/>
</Page>

