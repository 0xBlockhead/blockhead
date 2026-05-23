<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
</script>


<Page>
	<ActorNetworkView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.$actor.address,
			},
		)}
	/>
</Page>
