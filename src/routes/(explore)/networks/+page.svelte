<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
	<NetworksView
		href={resolve('/networks')}
		id="networks"
	/>
</Page>
