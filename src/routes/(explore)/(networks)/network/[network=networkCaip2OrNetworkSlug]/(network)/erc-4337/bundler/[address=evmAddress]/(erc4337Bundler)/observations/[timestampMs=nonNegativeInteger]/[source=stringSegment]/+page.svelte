<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.Erc4337Bundler_Timestamp, {
		$bundler: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$bundler: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			userOperationsCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337Bundler_TimestampView from '$/views/Erc4337Bundler_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ERC-4337 bundler timestamp'))} • ERC-4337 bundler timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337Bundler_TimestampView
		selection={pageSelection}
	/>
</Page>
