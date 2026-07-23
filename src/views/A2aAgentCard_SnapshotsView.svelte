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
		title = 'A2A agent card snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentCard_Snapshots-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.A2aAgentCard_Snapshot>
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
	entityType={EntityType.A2aAgentCard_Snapshot}
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
				name: true,
				version: true,
				contentHash: true,
				protocolVersion: true,
			},
		})
	}
	{countResource}
	getResourceItems={(a2aAgentCardSnapshots) => [...new Map(a2aAgentCardSnapshots.values.map((a2aAgentCardSnapshot) => [a2aAgentCardSnapshot[EntityMetaKey.SelectorKey], a2aAgentCardSnapshot])).values()]}
	getKey={(a2aAgentCardSnapshot) => a2aAgentCardSnapshot[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A agent card snapshots yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aAgentCardSnapshot })}
		{@const a2aAgentCardSnapshotFields = { ...a2aAgentCardSnapshot[EntityMetaKey.Selector], ...a2aAgentCardSnapshot }}
		<EntityView
			entityType={EntityType.A2aAgentCard_Snapshot}
			entitySelector={a2aAgentCardSnapshot[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((a2aAgentCardSnapshotFields.name) ?? '')].filter(Boolean).join(' ') || [String((a2aAgentCardSnapshotFields.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot'}
			{/snippet}

			{#snippet Value()}
				{[String((a2aAgentCardSnapshotFields.version) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((a2aAgentCardSnapshotFields.protocolVersion) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
