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

	const pageSelection = $derived(select(EntityType.ArweaveManifestPath, {
		$manifest: {
			transactionId: params.transactionId,
		},
		path: params.path,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ArweaveManifestPathView from '$/views/ArweaveManifestPathView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.path || 'Arweave manifest path'} • Arweave manifest path • Blockhead</title>
</svelte:head>


<Page>
	<ArweaveManifestPathView
		selection={pageSelection}
	/>
</Page>
