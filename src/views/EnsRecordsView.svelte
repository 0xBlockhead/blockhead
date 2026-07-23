<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'ENS records',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsRecords-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EnsRecord>
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
	entityType={EntityType.EnsRecord}
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
				recordKey: true,
				$name: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ensRecords) => [...new Map(ensRecords.values.map((ensRecord) => [ensRecord[EntityMetaKey.SelectorKey], ensRecord])).values()]}
	getKey={(ensRecord) => ensRecord[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS records yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensRecord })}
		{@const ensRecordFields = { ...ensRecord[EntityMetaKey.Selector], ...ensRecord }}
		<EntityView
			entityType={EntityType.EnsRecord}
			entitySelector={ensRecord[EntityMetaKey.Selector]}
			href={
				(
					ensRecord[EntityMetaKey.Selector] != null && 'recordKey' in ensRecord[EntityMetaKey.Selector]
					&& ensRecord[EntityMetaKey.Selector].recordKey != null
					&& ensRecord[EntityMetaKey.Selector] != null && '$name' in ensRecord[EntityMetaKey.Selector]
					&& ensRecord[EntityMetaKey.Selector].$name != null && 'name' in ensRecord[EntityMetaKey.Selector].$name
					&& ensRecord[EntityMetaKey.Selector].$name.name != null ?
						resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]', {
					recordId: encodeURIComponent(String(ensRecord[EntityMetaKey.Selector].recordKey ?? '')),
					ensName: encodeURIComponent(String(ensRecord[EntityMetaKey.Selector].$name.name ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((ensRecordFields.recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record'}
			{/snippet}

			{#snippet Value()}
				{[[String((ensRecordFields.$name.name) ?? '')].filter(Boolean).join(' ') || 'ENS name'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
