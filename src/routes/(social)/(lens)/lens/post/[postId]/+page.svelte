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
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<Page>
	<LensPostView
		href={
			resolve('/(social)/(lens)/lens/post/[postId]', {
				postId: params.postId,
			})
		}
		selection={
			select(EntityType.LensPost, {
				id: decodeURIComponent(params.postId),
			}, {
				sources: [
					Source.Lens_Graphql,
				],
				fields: {
					text: true,
					timestamp: true,
					$author: true,
					isEdited: true,
					isDeleted: true,
					contentUri: true,
					metadataHash: true,
					$commentOn: true,
					$quoteOf: true,
					$repostOf: true,
					$root: true,
				},
			})
		}
	/>
</Page>
