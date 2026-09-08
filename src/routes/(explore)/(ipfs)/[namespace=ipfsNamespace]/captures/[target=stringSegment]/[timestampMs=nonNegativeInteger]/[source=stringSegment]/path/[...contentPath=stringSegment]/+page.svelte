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

	const pageSelection = $derived(select(EntityType.IpfsResource_Timestamp, {
		$resource: {
			namespace: params.namespace,
			target: params.target,
			contentPath: params.contentPath,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResource_TimestampView from '$/views/IpfsResource_TimestampView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.timestampMs) || 'IPFS resource capture'} • IPFS resource capture • Blockhead</title>
</svelte:head>


<Page>
	<IpfsResource_TimestampView
		selection={pageSelection}
	/>
</Page>
