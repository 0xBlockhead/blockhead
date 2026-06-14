<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<EvmPrecompilesView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			selector: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$precompiles',
		}}
		id="precompiles"
	/>
</Page>
