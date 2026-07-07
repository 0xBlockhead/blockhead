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
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<Page>
	<AtprotoPostView
		href={
			resolve('/(social)/(atproto)/atproto/post/[...uri]', {
				uri: params.uri,
			})
		}
		selection={
			select(EntityType.AtprotoPost, {
				uri: decodeURIComponent(params.uri),
			}, {
				sources: [
					Source.Constants_Internal,
					Source.Atproto_Xrpc,
				],
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
