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

	const pageSelection = $derived(select(EntityType.EnsRecord_Timestamp, {
		$record: {
			$name: {
				name: decodeURIComponent(params.ensName),
			},
			recordKey: decodeURIComponent(params.recordId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$record: {
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				recordKey: decodeURIComponent(params.recordId),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			value: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecord_TimestampView from '$/views/EnsRecord_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'ENS record observation'} • ENS record observation • Blockhead</title>
</svelte:head>


<Page>
	<EnsRecord_TimestampView
		selection={pageSelection}
	/>
</Page>
