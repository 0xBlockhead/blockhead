<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import RssView from '$/views/RssView.svelte'
</script>


<Page>
	<RssView
		entityId={{ scope: 'RssNetwork' }}
	/>
</Page>
