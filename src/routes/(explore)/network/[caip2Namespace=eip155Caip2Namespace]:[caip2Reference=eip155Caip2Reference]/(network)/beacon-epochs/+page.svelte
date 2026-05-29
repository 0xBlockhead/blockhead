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
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<BeaconEpochsView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			entityId: networkIdFromCaip2RouteParams(params),
			fieldName: '$$beaconEpochs',
		}}
		id="beacon-epochs"
	/>
</Page>

