<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoActor_Timestamp, {
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$actor: {
				did: decodeURIComponent(params.did),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			$icon: true,
			displayName: true,
			handle: true,
			indexedAt: true,
			$banner: true,
			followersCount: true,
			followsCount: true,
			postsCount: true,
			description: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? ''), String((pageSelection.entitySelector.handle) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).handle) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • AT Protocol account observation • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActor_TimestampView
		href={
			resolve('/atproto/actor/[did=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				did: params.did,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
