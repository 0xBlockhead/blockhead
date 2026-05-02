<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<section>
		<EvmBlocksView
			entityFieldReference={{
				entityType: EntityType.Network,
				entityId: { chainId: Number(params.networkId) },
				fieldName: '$$evmBlocks',
			}}
			href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', params)}
			id="blocks"
		/>
	</section>
</Page>
