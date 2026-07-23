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
		title = 'ACP agent runtimes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AcpAgentRuntimes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AcpAgentRuntime>
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
	entityType={EntityType.AcpAgentRuntime}
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
				runtimeId: true,
				$programVersion: true,
				transportKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(acpAgentRuntimes) => [...new Map(acpAgentRuntimes.values.map((acpAgentRuntime) => [acpAgentRuntime[EntityMetaKey.SelectorKey], acpAgentRuntime])).values()]}
	getKey={(acpAgentRuntime) => acpAgentRuntime[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ACP agent runtimes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: acpAgentRuntime })}
		{@const acpAgentRuntimeFields = { ...acpAgentRuntime[EntityMetaKey.Selector], ...acpAgentRuntime }}
		<EntityView
			entityType={EntityType.AcpAgentRuntime}
			entitySelector={acpAgentRuntime[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((acpAgentRuntimeFields.runtimeId) ?? '')].filter(Boolean).join(' ') || 'ACP agent runtime'}
			{/snippet}

			{#snippet Value()}
				{[[String((acpAgentRuntimeFields.$programVersion.version) ?? '')].filter(Boolean).join(' ') || [[String((acpAgentRuntimeFields.$programVersion.$artifact.artifactType) ?? '')].filter(Boolean).join(' ') || [String((acpAgentRuntimeFields.$programVersion.$artifact.providerArtifactId) ?? ''), String((acpAgentRuntimeFields.$programVersion.$artifact.ociDigest) ?? ''), String((acpAgentRuntimeFields.$programVersion.$artifact.ipfsCid) ?? ''), String((acpAgentRuntimeFields.$programVersion.$artifact.arweaveId) ?? ''), String((acpAgentRuntimeFields.$programVersion.$artifact.gitObject) ?? ''), String((acpAgentRuntimeFields.$programVersion.$artifact.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ') || 'ACP agent program version'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((acpAgentRuntimeFields.transportKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
