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
			'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/transactions',
			{
				caip2Namespace: params.caip2Namespace,
				caip2Reference: params.caip2Reference,
			},
		)}
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$transactions',
		}}
		id="transactions"
	/>
</Page>
