<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<Page>
	<RssItemView
		entityId={data.entityId}
	/>
</Page>
