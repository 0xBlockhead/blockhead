<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
</script>


<Page>
	<section>
		<NetworkForksView
			entityId={{ chainId: Number(params.networkId) }}
			href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', params)}
			id="forks"
		/>
	</section>
</Page>
