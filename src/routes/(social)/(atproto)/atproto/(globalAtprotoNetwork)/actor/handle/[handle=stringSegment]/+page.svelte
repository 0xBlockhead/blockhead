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

	const pageSelection = $derived(select(EntityType.AtprotoActor, {
		handle: params.handle,
	}, {
		sources: [
			Source.Atproto_Xrpc,
		],
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'))
	const canonicalEntityHref = $derived(pageSelection.entity == null ? undefined : (({ ...pageSelection.entitySelector, ...pageSelection.entity }).did !== undefined ? resolve('/atproto/actor/[did=stringSegment]', {
		did: encodeURIComponent(String(({ ...pageSelection.entitySelector, ...pageSelection.entity }).did ?? '')),
	}) : undefined))

	$effect(() => {
		if (canonicalEntityHref == null) return

		globalThis.location.replace(canonicalEntityHref)
	})


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • AT Protocol account • Blockhead</title>
</svelte:head>


<Page>
	<ResourceBoundary resource={pageSelection}>
		{#snippet children()}
			<!-- The canonical alias navigation effect owns the resolved state. -->
		{/snippet}
	</ResourceBoundary>
</Page>
