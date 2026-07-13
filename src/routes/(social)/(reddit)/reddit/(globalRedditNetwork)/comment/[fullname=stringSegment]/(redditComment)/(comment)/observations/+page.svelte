<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditComment_TimestampsView from '$/views/RedditComment_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Comment observations • Blockhead</title>
</svelte:head>


<Page>
	<RedditComment_TimestampsView
		href={
			resolve('/reddit/comment/[fullname=stringSegment]/observations', {
				fullname: params.fullname,
			})
		}
		title='Comment observations'
		selection={
			select(EntityType.RedditComment, {
				fullname: decodeURIComponent(params.fullname),
			}).$$timestamps({
				sources: [
					Source.Reddit_PublicJson,
				],
			})
		}
		id='timestamps'
	/>
</Page>
