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
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<svelte:head>
	<title>Replies • Blockhead</title>
</svelte:head>


<Page>
	<RedditCommentsView
		href={
			resolve('/(social)/(reddit)/reddit/comment/[fullname]/(comment)/replies', {
				fullname: params.fullname,
			})
		}
		title='Replies'
		selection={
			select(EntityType.RedditComment, {
				fullname: decodeURIComponent(params.fullname),
			})[EntityProxyField]<EntityType.RedditComment>('$$replies')
		}
		id='RedditCommentsView-page'
	/>
</Page>
