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
	import Page from '$/components/Page.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<Page>
	<EvmTransactionsView
		href={resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/transactions',
			{
				caip2Namespace: params.caip2Namespace,
				caip2Reference: params.caip2Reference,
			},
		)}
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { chainId: evmChainIdFromCaip2RouteParams(params) },
			fieldName: '$$transactions',
		}}
		id="transactions"
	/>
</Page>
