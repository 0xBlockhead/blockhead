<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<svelte:head>
	<title>AT Protocol post • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostView
		href={
			resolve('/(social)/(atproto)/atproto/post/[...uri]', {
				uri: params.uri,
			})
		}
		selection={
			select(EntityType.AtprotoPost, data.selector, {
				fields: {
					text: true,
					createdAt: true,
					$author: true,
					$parent: true,
					$root: true,
					indexedAt: true,
					langs: true,
					selfLabelValues: true,
				},
			})
		}
	/>
</Page>
