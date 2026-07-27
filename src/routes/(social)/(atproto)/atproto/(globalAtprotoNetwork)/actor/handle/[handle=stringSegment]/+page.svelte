<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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
		fields: {
			did: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<svelte:head>
	<title>AT Protocol account • Blockhead</title>
</svelte:head>


<Page>
	<ResourceBoundary resource={pageSelection.did}>
		{#snippet children(resolvedField)}
			{#if typeof window !== 'undefined'}
				{@const canonicalEntityHref = resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
					{
						did: encodeURIComponent(String({ ...pageSelection.entitySelector, did: resolvedField }.did)),
					}
				)}
				{#if canonicalEntityHref != null}
					{globalThis.location.replace(canonicalEntityHref)}
				{/if}
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
