<script lang="ts">
	// State
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<Page>
	<RssFeedView
		selector={data.selector}
	/>
</Page>
