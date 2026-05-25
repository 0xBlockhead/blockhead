<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
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
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$beaconEpochs',
		}}
		id="beacon-epochs"
	/>
</Page>

