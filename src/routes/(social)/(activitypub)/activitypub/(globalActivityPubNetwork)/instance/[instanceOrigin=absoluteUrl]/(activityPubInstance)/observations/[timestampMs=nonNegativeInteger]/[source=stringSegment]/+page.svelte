<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
	<title>{(pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'ActivityPub instance observation' : [(pageSelection.entity.title ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation')} • ActivityPub instance observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubInstance_TimestampView
		selection={pageSelection}
	/>
</Page>
