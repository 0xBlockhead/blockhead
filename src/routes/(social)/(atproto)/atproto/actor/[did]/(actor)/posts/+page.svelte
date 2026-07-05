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
	<title>Account posts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostsView
		href={
			resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/posts', {
				did: params.did,
			})
		}
		title='Account posts'
		selection={
			select(EntityType.AtprotoActor, {
				did: decodeURIComponent(params.did),
			})[EntityProxyField]<EntityType.AtprotoPost>('$$posts', {
				sources: [
					Source.Atproto_Xrpc,
				],
			})
		}
		id='posts'
	/>
</Page>
