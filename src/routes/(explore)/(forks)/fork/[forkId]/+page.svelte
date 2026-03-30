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
		entityId={(
			((fid) => ({
				$network: { chainId: Number(fid.split(':')[0]) || 1 },
				forkId: fid.split(':').slice(1).join(':') || fid,
			}))(params.forkId)
		)}
		href={resolve('/(explore)/(forks)/fork/[forkId]', params)}
	/>
</Page>
