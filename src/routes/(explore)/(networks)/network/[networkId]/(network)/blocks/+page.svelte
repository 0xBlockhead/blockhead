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
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<Page>
	<EvmBlocksView
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/blocks',
			{
				networkId: String(params.networkId),
			},
		)}
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$blocks',
		}}
		id="blocks"
	/>
</Page>
