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
			entityType: EntityType.EvmNetwork,
			entityId: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$blobs',
		}}
		href={resolve(
			'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/blobs',
			{
				caip2Namespace: params.caip2Namespace,
				caip2Reference: params.caip2Reference,
			},
		)}
		id="blobs"
	/>
</Page>
