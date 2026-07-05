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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>Thread posts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostsView
		href={
			resolve('/(social)/(atproto)/atproto/post/[...uri]/(post)/thread', {
				uri: params.uri,
			})
		}
		title='Thread posts'
		selection={
			select(EntityType.AtprotoPost, {
				uri: decodeURIComponent(params.uri),
			})[EntityProxyField]<EntityType.AtprotoPost>('$$thread', {
				sources: [
					Source.Atproto_Xrpc,
				],
			})
		}
		id='thread'
	/>
</Page>
