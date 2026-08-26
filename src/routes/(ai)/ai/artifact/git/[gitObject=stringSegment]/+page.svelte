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

	const pageSelection = $derived(select(EntityType.AiArtifact, {
		gitObject: params.gitObject,
	}, {
		sources: [
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
		fields: {
			artifactType: true,
			providerArtifactId: true,
			ociDigest: true,
			ipfsCid: true,
			arweaveId: true,
			digest: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.gitObject ?? '') || 'AI artifact' : (pageSelection.entity.artifactType ?? '') || [(pageSelection.entity.providerArtifactId ?? ''), (pageSelection.entity.ociDigest ?? ''), (pageSelection.entity.ipfsCid ?? ''), (pageSelection.entity.arweaveId ?? ''), (pageSelection.entitySelector.gitObject ?? ''), (pageSelection.entity.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'} • AI artifact • Blockhead</title>
</svelte:head>


<Page>
	<AiArtifactView
		selection={pageSelection}
	/>
</Page>
