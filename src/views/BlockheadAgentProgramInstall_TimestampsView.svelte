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
		title = 'Blockhead agent program install observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProgramInstall_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentProgramInstall_Timestamp>
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
	entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
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
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentProgramInstallTimestamps) => [...new Map(blockheadAgentProgramInstallTimestamps.values.map((blockheadAgentProgramInstallTimestamp) => [blockheadAgentProgramInstallTimestamp[EntityMetaKey.SelectorKey], blockheadAgentProgramInstallTimestamp])).values()]}
	getKey={(blockheadAgentProgramInstallTimestamp) => blockheadAgentProgramInstallTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent program install observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentProgramInstallTimestamp })}
		{@const blockheadAgentProgramInstallTimestampFields = { ...blockheadAgentProgramInstallTimestamp[EntityMetaKey.Selector], ...blockheadAgentProgramInstallTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadAgentProgramInstall_Timestamp}
			entitySelector={blockheadAgentProgramInstallTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentProgramInstallTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead agent program install timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentProgramInstallTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAgentProgramInstallTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
