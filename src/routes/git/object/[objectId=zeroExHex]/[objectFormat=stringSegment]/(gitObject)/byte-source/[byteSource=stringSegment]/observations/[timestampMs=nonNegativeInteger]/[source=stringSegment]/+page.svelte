<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitObjectVerification_Timestamp, {
		objectId: params.objectId,
		objectFormat: params.objectFormat,
		byteSource: params.byteSource,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitObjectVerification_TimestampView from '$/views/GitObjectVerification_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.objectId || 'Git object verification timestamp'} • Git object verification timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GitObjectVerification_TimestampView
		selection={pageSelection}
	/>
</Page>
