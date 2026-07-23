<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'ACP agent program versions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentProgramVersions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AcpAgentProgramVersion>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentProgramVersion}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				version: true,
				$program: true,
				$artifact: true,
				distributionKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(acpAgentProgramVersions) => [...new Map(acpAgentProgramVersions.values.map((acpAgentProgramVersion) => [acpAgentProgramVersion[EntityMetaKey.SelectorKey], acpAgentProgramVersion])).values()]}
	getKey={(acpAgentProgramVersion) => acpAgentProgramVersion[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP agent program versions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpAgentProgramVersion })}
		{@const acpAgentProgramVersionFields = { ...acpAgentProgramVersion[EntityMetaKey.Selector], ...acpAgentProgramVersion }}
		<EntityView
			entityType={EntityType.AcpAgentProgramVersion}
			entitySelector={acpAgentProgramVersion[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((acpAgentProgramVersionFields.version) ?? '')].filter(Boolean).join(' ') || [[String((acpAgentProgramVersionFields.$artifact.artifactType) ?? '')].filter(Boolean).join(' ') || [String((acpAgentProgramVersionFields.$artifact.providerArtifactId) ?? ''), String((acpAgentProgramVersionFields.$artifact.ociDigest) ?? ''), String((acpAgentProgramVersionFields.$artifact.ipfsCid) ?? ''), String((acpAgentProgramVersionFields.$artifact.arweaveId) ?? ''), String((acpAgentProgramVersionFields.$artifact.gitObject) ?? ''), String((acpAgentProgramVersionFields.$artifact.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ') || 'ACP agent program version'}
			{/snippet}

			{#snippet Value()}
				{[[String((acpAgentProgramVersionFields.$program.label) ?? '')].filter(Boolean).join(' ') || [String((acpAgentProgramVersionFields.$program.registryAgentId) ?? ''), String((acpAgentProgramVersionFields.$program.packageName) ?? ''), String((acpAgentProgramVersionFields.$program.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'ACP agent program'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((acpAgentProgramVersionFields.distributionKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
