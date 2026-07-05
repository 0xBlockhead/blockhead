<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<svelte:head>
	<title>Lens post comments • Blockhead</title>
</svelte:head>


<Page>
	<LensPostsView
		href={
			resolve('/(social)/(lens)/lens/post/[postId]/(post)/comments', {
				postId: params.postId,
			})
		}
		title='Lens post comments'
		selection={
			select(EntityType.LensPost, {
				id: decodeURIComponent(params.postId),
			})[EntityProxyField]<EntityType.LensPost>('$$comments', {
				sources: [
					Source.Lens_Graphql,
				],
			})
		}
		id='comments'
	/>
</Page>
