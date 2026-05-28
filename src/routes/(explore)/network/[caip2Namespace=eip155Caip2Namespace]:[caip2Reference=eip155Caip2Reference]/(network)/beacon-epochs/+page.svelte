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
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<BeaconEpochsView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: { chainId: evmChainIdFromCaip2RouteParams(params) },
			fieldName: '$$beaconEpochs',
		}}
		id="beacon-epochs"
	/>
</Page>

