<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


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
			entityId: networkIdFromCaip2RouteParams(params),
			fieldName: '$$blobs',
		}}
		href={resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/blobs',
			{
				caip2Namespace: params.caip2Namespace,
				caip2Reference: params.caip2Reference,
			},
		)}
		id="blobs"
	/>
</Page>
