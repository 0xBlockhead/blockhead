<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
</script>


<Page>
	<NetworkForkView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			forkId: params.forkSlug,
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(forks)/(fork)/fork/[forkSlug]',
			params,
		)}
	/>
</Page>
