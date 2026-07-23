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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>Account posts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostsView
		href={
			resolve('/atproto/actor/[did=stringSegment]/posts', {
				did: params.did,
			})
		}
		title='Account posts'
		selection={
			select(EntityType.AtprotoActor, {
				did: decodeURIComponent(params.did),
			})
				.$$posts({
					sources: [
						Source.Atproto_Xrpc,
					],
				})
		}
		countResource={
			select(EntityType.AtprotoActor, {
				did: decodeURIComponent(params.did),
			})
				.$$posts({
					sources: [
						Source.Atproto_Xrpc,
					],
				}).count
		}
		id='posts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
