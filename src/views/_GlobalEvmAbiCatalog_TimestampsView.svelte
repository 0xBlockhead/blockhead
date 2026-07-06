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
		title = 'Global EVM ABI catalog observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEvmAbiCatalog_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalEvmAbiCatalog_Timestamp>
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
	import GlobalEvmAbiCatalog_TimestampView from '$/views/_GlobalEvmAbiCatalog_TimestampView.svelte'
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
					$hub: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalEvmAbiCatalogTimestamps)}
			{@const uniqueGlobalEvmAbiCatalogTimestamps = [...new Map(globalEvmAbiCatalogTimestamps.values.map((globalEvmAbiCatalogTimestamp) => [globalEvmAbiCatalogTimestamp[EntityMetaKey.SelectorKey], globalEvmAbiCatalogTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalEvmAbiCatalogTimestamps.totalCount}
				getKey={(globalEvmAbiCatalogTimestamp) => globalEvmAbiCatalogTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalEvmAbiCatalogTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global EVM ABI catalog observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalEvmAbiCatalogTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalEvmAbiCatalog_Timestamp> })}
					{@const globalEvmAbiCatalogTimestampFields = { ...globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector], ...globalEvmAbiCatalogTimestamp }}
					<GlobalEvmAbiCatalog_TimestampView
						selection={select(EntityType._GlobalEvmAbiCatalog_Timestamp, globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector])}
						prefetched={globalEvmAbiCatalogTimestampFields}
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
		entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
