<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<Page>
	<section>
		<EvmBlocksView
			entityId={{ chainId: Number(params.networkId) }}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(forks)/(fork)/fork/[forkSlug]/blocks',
				params,
			)}
			id="blocks"
		/>
	</section>
</Page>
