<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
	<section>
		<BeaconSlotView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				slot: Number(params.slotNumber),
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
				params,
			)}
		/>
	</section>
</Page>
