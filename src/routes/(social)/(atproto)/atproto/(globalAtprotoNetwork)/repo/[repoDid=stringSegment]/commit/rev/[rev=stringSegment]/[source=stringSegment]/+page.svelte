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
		rev: params.rev,
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			commitCid: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoRepoCommitView from '$/views/AtprotoRepoCommitView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.rev ?? '') || 'AT Protocol repo commit' : [pageSelection.entitySelector.rev, pageSelection.entity.commitCid].filter(Boolean).join(' ') || 'AT Protocol repo commit'} • AT Protocol repo commit • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoRepoCommitView
		selection={pageSelection}
	/>
</Page>
