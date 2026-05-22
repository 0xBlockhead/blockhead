<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RssView from '$/views/RssView.svelte'
</script>


<Page>
	<RssView
		entityId={{ scope: 'RssNetwork' }}
		href={resolve('/(social)/rss')}
	/>
</Page>
