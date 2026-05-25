<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobsView from '$/views/EvmBlobsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<EvmBlobsView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$blobs',
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/blobs',
			{
			networkId: params.networkId,
			},
		)}
		id="blobs"
	/>
</Page>

