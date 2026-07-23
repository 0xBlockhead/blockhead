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


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation' : [String((({ ...{
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).displayName) ?? ''), String((({ ...{
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).handle) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		$actor: {
			did: decodeURIComponent(params.did),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation')} • AT Protocol account observation • Blockhead</title>
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
