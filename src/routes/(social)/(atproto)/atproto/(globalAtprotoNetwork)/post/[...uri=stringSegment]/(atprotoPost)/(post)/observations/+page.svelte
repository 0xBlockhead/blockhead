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
	import AtprotoPost_TimestampsView from '$/views/AtprotoPost_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Post observations • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPost_TimestampsView
		href={
			resolve('/atproto/post/[...uri=stringSegment]/observations', {
				uri: params.uri,
			})
		}
		title='Post observations'
		selection={
			select(EntityType.AtprotoPost, {
				uri: decodeURIComponent(params.uri),
			}).$$timestamps({
				sources: [
					Source.Atproto_Xrpc,
				],
				count: true,
			})
		}
		id='timestamps'
	/>
</Page>
