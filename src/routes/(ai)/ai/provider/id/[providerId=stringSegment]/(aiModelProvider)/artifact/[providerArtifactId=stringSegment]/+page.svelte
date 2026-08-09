<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiArtifact, data.selector, {
		sources: [
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
		fields: {
			artifactType: true,
			ociDigest: true,
			ipfsCid: true,
			arweaveId: true,
			gitObject: true,
			digest: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.providerArtifactId ?? '') || 'AI artifact' : (pageSelection.entity.artifactType ?? '') || [(pageSelection.entitySelector.providerArtifactId ?? ''), (pageSelection.entity.ociDigest ?? ''), (pageSelection.entity.ipfsCid ?? ''), (pageSelection.entity.arweaveId ?? ''), (pageSelection.entity.gitObject ?? ''), (pageSelection.entity.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact')} • AI artifact • Blockhead</title>
</svelte:head>


<Page>
	<AiArtifactView
		selection={pageSelection}
	/>
</Page>
