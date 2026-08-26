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

	const pageSelection = $derived(select(EntityType.AtprotoRepoCommit, {
		repoDid: params.repoDid,
		commitCid: params.commitCid,
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			rev: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoRepoCommitView from '$/views/AtprotoRepoCommitView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.commitCid ?? '') || 'AT Protocol repo commit' : [pageSelection.entity.rev, pageSelection.entitySelector.commitCid].filter(Boolean).join(' ') || 'AT Protocol repo commit'} • AT Protocol repo commit • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoRepoCommitView
		selection={pageSelection}
	/>
</Page>
