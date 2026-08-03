<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RedditComment, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
		],
		fields: {
			body: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.fullname ?? '') || 'Reddit comment' : (pageSelection.entity.body ?? '') || pageSelection.entitySelector.fullname || 'Reddit comment')} • Reddit comment • Blockhead</title>
</svelte:head>


<Page>
	<RedditCommentView
		selection={pageSelection}
	/>
</Page>
