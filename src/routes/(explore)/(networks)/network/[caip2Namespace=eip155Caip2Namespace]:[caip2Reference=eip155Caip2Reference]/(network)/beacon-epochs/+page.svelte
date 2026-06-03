<script lang="ts">
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
			entityId: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$beaconEpochs',
		}}
		id="beacon-epochs"
	/>
</Page>
