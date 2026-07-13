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
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account observations • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActor_TimestampsView
		href={
			resolve('/atproto/actor/[did=stringSegment]/observations', {
				did: params.did,
			})
		}
		title='Account observations'
		selection={
			select(EntityType.AtprotoActor, {
				did: decodeURIComponent(params.did),
			}).$$timestamps({
				sources: [
					Source.Atproto_Xrpc,
				],
			})
		}
		id='timestamps'
	/>
</Page>
