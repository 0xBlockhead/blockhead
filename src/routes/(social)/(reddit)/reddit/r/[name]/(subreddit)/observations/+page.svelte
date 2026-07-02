<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Subreddit observations • Blockhead</title>
</svelte:head>


<Page>
	<RedditSubreddit_TimestampsView
		href={
			resolve('/(social)/(reddit)/reddit/r/[name]/(subreddit)/observations', {
				name: params.name,
			})
		}
		title='Subreddit observations'
		selection={
			select(EntityType.RedditSubreddit, {
				name: decodeURIComponent(params.name),
			})[EntityProxyField]<EntityType.RedditSubreddit_Timestamp>('$$timestamps')
		}
		id='RedditSubreddit_TimestampsView-page'
	/>
</Page>
