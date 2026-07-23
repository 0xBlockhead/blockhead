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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoActor, data.selector, {
		sources: [
			Source.Atproto_Xrpc,
		],
		fields: {
			handle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account' : [String((({ ...data.selector, ...pageSelection.entity }).did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'))} • AT Protocol account • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActorView
		href={
			resolve('/atproto/actor/[did=stringSegment]', {
				did: params.did,
			})
		}
		selection={pageSelection}
	/>
</Page>
