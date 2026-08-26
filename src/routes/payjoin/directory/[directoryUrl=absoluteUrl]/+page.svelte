<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PayjoinDirectory, {
		directoryUrl: decodeURIComponent(params.directoryUrl),
	}, {
		sources: [
			Source.PayjoinDirectory_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PayjoinDirectoryView from '$/views/PayjoinDirectoryView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.directoryUrl || 'payjoin directory'} • payjoin directory • Blockhead</title>
</svelte:head>


<Page>
	<PayjoinDirectoryView
		selection={pageSelection}
	/>
</Page>
