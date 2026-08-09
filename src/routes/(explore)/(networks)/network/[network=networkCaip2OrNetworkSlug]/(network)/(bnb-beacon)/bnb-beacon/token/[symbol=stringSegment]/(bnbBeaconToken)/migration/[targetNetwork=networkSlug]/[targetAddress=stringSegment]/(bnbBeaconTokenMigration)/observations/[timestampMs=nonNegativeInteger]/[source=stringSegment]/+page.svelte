<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BnbBeaconTokenMigration_Timestamp, {
		$migration: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenMigration_TimestampView from '$/views/BnbBeaconTokenMigration_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bnb beacon token migration timestamp')} • bnb beacon token migration timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconTokenMigration_TimestampView
		selection={pageSelection}
	/>
</Page>
