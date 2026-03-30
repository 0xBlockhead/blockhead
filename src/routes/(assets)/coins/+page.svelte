<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<Page>
	<CoinsView
		href={resolve('/coins')}
		id="coins"
	/>
</Page>
