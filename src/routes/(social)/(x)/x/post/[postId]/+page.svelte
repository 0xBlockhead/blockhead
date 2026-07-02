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
	import XPostView from '$/views/XPostView.svelte'
</script>


<svelte:head>
	<title>X post • Blockhead</title>
</svelte:head>


<Page>
	<XPostView
		href={
			resolve('/(social)/(x)/x/post/[postId]', {
				postId: params.postId,
			})
		}
		selection={
			select(EntityType.XPost, data.selector, {
				fields: {
					text: true,
					createdAt: true,
					$author: true,
					postUrl: true,
					$replyToPost: true,
					$quotedPost: true,
				},
			})
		}
	/>
</Page>
