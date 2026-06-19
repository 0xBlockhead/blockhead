<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeView from '$/views/YouTubeView.svelte'
</script>


<Page>
	<YouTubeView
		selection={select(EntityType.YouTubeNetwork, {
			scope: 'YouTubeNetwork',
		})}
	/>
</Page>
