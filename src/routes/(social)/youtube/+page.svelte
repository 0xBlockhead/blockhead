<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeView from '$/views/YouTubeView.svelte'
</script>


<Page>
	<YouTubeView
		entityId={{
			scope: 'YouTubeNetwork',
		}}
	/>
</Page>
