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
	<NetworkForksView
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', params)}
		id="forks"
	/>
</Page>
