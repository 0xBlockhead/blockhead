<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
	<section>
		<NetworksView
			href={resolve('/networks')}
			id="networks"
		/>
	</section>
</Page>
