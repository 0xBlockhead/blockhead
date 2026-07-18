<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bnb beacon token migration observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenMigration_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconTokenMigration_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BnbBeaconTokenMigration_TimestampView from '$/views/BnbBeaconTokenMigration_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
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
	getResourceItems={(bnbBeaconTokenMigrationTimestamps) => [...new Map(bnbBeaconTokenMigrationTimestamps.values.map((bnbBeaconTokenMigrationTimestamp) => [bnbBeaconTokenMigrationTimestamp[EntityMetaKey.SelectorKey], bnbBeaconTokenMigrationTimestamp])).values()]}
	getKey={(bnbBeaconTokenMigrationTimestamp) => bnbBeaconTokenMigrationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon token migration observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconTokenMigrationTimestamp })}
		{@const bnbBeaconTokenMigrationTimestampFields = { ...bnbBeaconTokenMigrationTimestamp[EntityMetaKey.Selector], ...bnbBeaconTokenMigrationTimestamp }}
		{@const selection = select(EntityType.BnbBeaconTokenMigration_Timestamp, bnbBeaconTokenMigrationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconTokenMigration_TimestampView
			selection={selection}
			prefetched={bnbBeaconTokenMigrationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
