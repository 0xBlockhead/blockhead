<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import RedditView from '$/views/RedditView.svelte'
</script>


<Page>
	<RedditView
		selection={select(EntityType.RedditNetwork, { scope: 'RedditNetwork' })}
	/>
</Page>
