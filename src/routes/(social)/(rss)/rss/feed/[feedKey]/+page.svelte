<script lang="ts">
	// Props
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<Page>
	<RssFeedView
		entityId={data.entityId}
	/>
</Page>
