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
	import XPostView from '$/views/XPostView.svelte'
</script>


<Page>
	<XPostView
		href={
			resolve('/(social)/(x)/x/post/[postId]', {
				postId: params.postId,
			})
		}
		selection={
			select(EntityType.XPost, {
				id: decodeURIComponent(params.postId),
			}, {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
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
