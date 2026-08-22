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

	const pageSelection = $derived(select(EntityType.TokenProgramExtension_Timestamp, {
		$assetInstance: data.selector,
		extensionKind: params.extensionKind,
		extensionScope: params.extensionScope,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TokenProgramExtension_TimestampView from '$/views/TokenProgramExtension_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.extensionKind || 'token program extension timestamp')} • token program extension timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TokenProgramExtension_TimestampView
		selection={pageSelection}
	/>
</Page>
