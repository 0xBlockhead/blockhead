<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bnb beacon token migration observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenMigration_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BnbBeaconTokenMigration_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BnbBeaconTokenMigration_TimestampView from '$/views/BnbBeaconTokenMigration_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bnbBeaconTokenMigrationTimestamps)}
			{@const uniqueBnbBeaconTokenMigrationTimestamps = [...new Map(bnbBeaconTokenMigrationTimestamps.values.map((bnbBeaconTokenMigrationTimestamp) => [bnbBeaconTokenMigrationTimestamp[EntityMetaKey.SelectorKey], bnbBeaconTokenMigrationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bnbBeaconTokenMigrationTimestamps.totalCount}
				getKey={(bnbBeaconTokenMigrationTimestamp) => bnbBeaconTokenMigrationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBnbBeaconTokenMigrationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bnb beacon token migration observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bnbBeaconTokenMigrationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BnbBeaconTokenMigration_Timestamp> })}
					{@const bnbBeaconTokenMigrationTimestampFields = { ...bnbBeaconTokenMigrationTimestamp[EntityMetaKey.Selector], ...bnbBeaconTokenMigrationTimestamp }}
					<BnbBeaconTokenMigration_TimestampView
						selection={select(EntityType.BnbBeaconTokenMigration_Timestamp, bnbBeaconTokenMigrationTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bnbBeaconTokenMigrationTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
