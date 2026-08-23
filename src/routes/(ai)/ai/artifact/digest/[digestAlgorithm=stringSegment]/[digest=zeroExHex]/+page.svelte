<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiArtifact, data.selector, {
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
						gitObject: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.digest ?? '') || 'AI artifact' : (pageSelection.entity.artifactType ?? '') || [(pageSelection.entity.providerArtifactId ?? ''), (pageSelection.entity.ociDigest ?? ''), (pageSelection.entity.ipfsCid ?? ''), (pageSelection.entity.arweaveId ?? ''), (pageSelection.entity.gitObject ?? ''), (pageSelection.entitySelector.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact')} • AI artifact • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AI artifact'} • AI artifact • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiArtifact, data.selector, {
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
						gitObject: true,
					},
				}))}

		<AiArtifactView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
