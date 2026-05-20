<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'

	let { data }: PageProps = $props()
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
