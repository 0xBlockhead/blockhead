<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeView from '$/views/YouTubeView.svelte'
</script>


<Page>
	<YouTubeView
		entityId={{
			scope: 'YouTubeNetwork',
		}}
		href={resolve('/youtube')}
	/>
</Page>
