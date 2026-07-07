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
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<Page>
	<RedditSubredditView
		href={
			resolve('/(social)/(reddit)/reddit/r/[name]', {
				name: params.name,
			})
		}
		selection={
			select(EntityType.RedditSubreddit, {
				name: decodeURIComponent(params.name),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$icon: true,
					title: true,
					publicDescription: true,
					createdAt: true,
					over18: true,
				},
			})
		}
	/>
</Page>
