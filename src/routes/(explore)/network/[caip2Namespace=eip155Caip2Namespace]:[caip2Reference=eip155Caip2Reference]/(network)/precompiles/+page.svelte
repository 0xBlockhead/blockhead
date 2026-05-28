<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<EvmPrecompilesView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { chainId: evmChainIdFromCaip2RouteParams(params) },
			fieldName: '$$precompiles',
		}}
		id="precompiles"
	/>
</Page>
