<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		caip2RouteParamsFromEvmChainId,
		networkIdFromEvmChainId,
	} from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/contracts',
			{
				...caip2RouteParamsFromEvmChainId(1),
			},
		)}
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: networkIdFromEvmChainId(1),
			fieldName: '$$contracts',
		}}
		id="contracts"
	/>
</Page>
