<script lang="ts">
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
		selector={data.selector}
	/>
</Page>
