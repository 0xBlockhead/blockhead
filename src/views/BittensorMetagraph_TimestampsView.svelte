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
		title = 'Bittensor metagraph observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorMetagraph_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BittensorMetagraph_Timestamp>
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
	entityType={EntityType.BittensorMetagraph_Timestamp}
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
				metagraphByteLength: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bittensorMetagraphTimestamps) => [...new Map(bittensorMetagraphTimestamps.values.map((bittensorMetagraphTimestamp) => [bittensorMetagraphTimestamp[EntityMetaKey.SelectorKey], bittensorMetagraphTimestamp])).values()]}
	getKey={(bittensorMetagraphTimestamp) => bittensorMetagraphTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bittensor metagraph observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bittensorMetagraphTimestamp })}
		{@const bittensorMetagraphTimestampFields = { ...bittensorMetagraphTimestamp[EntityMetaKey.Selector], ...bittensorMetagraphTimestamp }}
		<EntityView
			entityType={EntityType.BittensorMetagraph_Timestamp}
			entitySelector={bittensorMetagraphTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bittensorMetagraphTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Bittensor metagraph observation'}
			{/snippet}

			{#snippet Value()}
				{[String((bittensorMetagraphTimestampFields.metagraphByteLength) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
