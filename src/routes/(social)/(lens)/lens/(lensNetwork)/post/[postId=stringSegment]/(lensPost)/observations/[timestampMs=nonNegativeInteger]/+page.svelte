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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensPost_TimestampView from '$/views/LensPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'Lens post observation'} • Lens post observation • Blockhead</title>
</svelte:head>


<Page>
	<LensPost_TimestampView
		selection={
			select(EntityType.LensPost_Timestamp, {
				$post: {
					id: params.postId,
				},
				timestampMs: Number(params.timestampMs),
			}, {
				sources: [
					Source.Lens_Graphql,
				],
			})
		}
	/>
</Page>
