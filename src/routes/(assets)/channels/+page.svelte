<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import StateChannelsView from '$/views/StateChannelsView.svelte'
</script>


<Page>
	<StateChannelsView
		href={resolve('/channels')}
		id="channels"
	/>
</Page>
