<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditView from '$/views/RedditView.svelte'
</script>


<Page>
	<RedditView
		entityId={{ scope: 'RedditNetwork' }}
		href={resolve('/(social)/reddit')}
	/>
</Page>
