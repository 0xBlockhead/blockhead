<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/contracts',
			{
				...{ caip2Namespace: 'eip155' as const, caip2Reference: `${1}` },
			},
		)}
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { caip2: { namespace: 'eip155' as const, reference: String(1) } },
			fieldName: '$$contracts',
		}}
		id="contracts"
	/>
</Page>
