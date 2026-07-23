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
		title = 'AI artifact attestations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiArtifactAttestations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiArtifactAttestation>
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
	entityType={EntityType.AiArtifactAttestation}
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
				attestationKind: true,
				$artifact: {
					fields: {
						artifactType: true,
						mediaType: true,
						providerArtifactId: true,
						ociDigest: true,
						ipfsCid: true,
						arweaveId: true,
						gitObject: true,
						digest: true,
						size: true,
					},
				},
				logEntryId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiArtifactAttestations) => [...new Map(aiArtifactAttestations.values.map((aiArtifactAttestation) => [aiArtifactAttestation[EntityMetaKey.SelectorKey], aiArtifactAttestation])).values()]}
	getKey={(aiArtifactAttestation) => aiArtifactAttestation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI artifact attestations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiArtifactAttestation })}
		{@const aiArtifactAttestationFields = { ...aiArtifactAttestation[EntityMetaKey.Selector], ...aiArtifactAttestation }}
		<EntityView
			entityType={EntityType.AiArtifactAttestation}
			entitySelector={aiArtifactAttestation[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiArtifactAttestationFields.attestationKind) ?? '')].filter(Boolean).join(' ') || 'AI artifact attestation'}
			{/snippet}

			{#snippet Value()}
				{[[String((aiArtifactAttestationFields.$artifact.artifactType) ?? '')].filter(Boolean).join(' ') || [String((aiArtifactAttestationFields.$artifact.providerArtifactId) ?? ''), String((aiArtifactAttestationFields.$artifact.ociDigest) ?? ''), String((aiArtifactAttestationFields.$artifact.ipfsCid) ?? ''), String((aiArtifactAttestationFields.$artifact.arweaveId) ?? ''), String((aiArtifactAttestationFields.$artifact.gitObject) ?? ''), String((aiArtifactAttestationFields.$artifact.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiArtifactAttestationFields.logEntryId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
