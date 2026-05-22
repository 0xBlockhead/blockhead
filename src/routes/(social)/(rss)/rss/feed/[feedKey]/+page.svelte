<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		href={resolve('/(social)/(rss)/rss/feed/[feedKey]', {
			feedKey: encodeURIComponent(data.entityId.feedUrl),
		})}
	/>
</Page>
