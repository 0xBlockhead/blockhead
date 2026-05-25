<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
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
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$precompiles',
		}}
		id="precompiles"
	/>
</Page>
