<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<svelte:head>
	<title>Popular submissions • Blockhead</title>
</svelte:head>


<Page>
	<RedditLinksView
		href={resolve('/(social)/(reddit)/reddit/links')}
		title='Popular submissions'
		selection={
			select(EntityType._GlobalRedditNetwork, {
				scope: '_GlobalRedditNetwork',
			})[EntityProxyField]<EntityType.RedditLink>('$$sourceWindowLinks')
		}
		id='RedditLinksView-page'
	/>
</Page>
