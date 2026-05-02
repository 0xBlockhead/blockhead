<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<section>
		<BeaconEpochView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				epoch: Number(params.epochNumber),
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
				params,
			)}
		/>
	</section>
</Page>
