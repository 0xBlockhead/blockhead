<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import VaultsView from '$/views/VaultsView.svelte'
</script>


<Page>
	<VaultsView
		href={resolve('/vaults')}
		id="vaults"
	/>
</Page>
