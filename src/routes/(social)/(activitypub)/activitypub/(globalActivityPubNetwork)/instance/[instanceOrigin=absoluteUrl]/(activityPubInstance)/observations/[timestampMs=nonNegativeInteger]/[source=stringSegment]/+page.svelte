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

	const pageSelection = $derived(select(EntityType.ActivityPubInstance_Timestamp, {
		$instance: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$instance: {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			title: true,
			version: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		$instance: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation' : [String((({ ...{
		$instance: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).title) ?? ''), String((({ ...{
		$instance: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation')} • ActivityPub instance observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubInstance_TimestampView
		href={
			resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				instanceOrigin: params.instanceOrigin,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
