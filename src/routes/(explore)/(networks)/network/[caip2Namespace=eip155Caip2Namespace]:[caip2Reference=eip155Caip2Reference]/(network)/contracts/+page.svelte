<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


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
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/contracts',
			{
				caip2Namespace: params.caip2Namespace,
				caip2Reference: params.caip2Reference,
			},
		)}
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: networkIdFromCaip2RouteParams(params),
			fieldName: '$$contracts',
		}}
		id="contracts"
	/>
</Page>
