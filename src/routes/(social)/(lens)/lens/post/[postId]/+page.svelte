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
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<svelte:head>
	<title>Lens post • Blockhead</title>
</svelte:head>


<Page>
	<LensPostView
		href={
			resolve('/(social)/(lens)/lens/post/[postId]', {
				postId: params.postId,
			})
		}
		selection={
			select(EntityType.LensPost, data.selector, {
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
