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
		title = 'Bnb beacon token migrations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokenMigrations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BnbBeaconTokenMigration>
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
	import BnbBeaconTokenMigrationView from '$/views/BnbBeaconTokenMigrationView.svelte'
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
					migrationKind: true,
					$token: true,
					$targetNetwork: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenMigration}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bnbBeaconTokenMigrations)}
			{@const uniqueBnbBeaconTokenMigrations = [...new Map(bnbBeaconTokenMigrations.values.map((bnbBeaconTokenMigration) => [bnbBeaconTokenMigration[EntityMetaKey.SelectorKey], bnbBeaconTokenMigration])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconTokenMigration}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bnbBeaconTokenMigrations.totalCount}
				getKey={(bnbBeaconTokenMigration) => bnbBeaconTokenMigration[EntityMetaKey.SelectorKey]}
				items={uniqueBnbBeaconTokenMigrations}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bnb beacon token migrations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bnbBeaconTokenMigration }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BnbBeaconTokenMigration> })}
					{@const bnbBeaconTokenMigrationFields = { ...bnbBeaconTokenMigration[EntityMetaKey.Selector], ...bnbBeaconTokenMigration }}
					<BnbBeaconTokenMigrationView
						selection={select(EntityType.BnbBeaconTokenMigration, bnbBeaconTokenMigration[EntityMetaKey.Selector])}
						prefetched={bnbBeaconTokenMigrationFields}
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
		entityType={EntityType.BnbBeaconTokenMigration}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
