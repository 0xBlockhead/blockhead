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
			$icon: true,
			displayName: true,
			indexedAt: true,
			$banner: true,
			description: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? ''), String((pageSelection.entitySelector.handle) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).handle) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account')))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • AT Protocol account • Blockhead</title>
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
