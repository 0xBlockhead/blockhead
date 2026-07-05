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
		title = 'Near contract storage entries',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NearContractStorageEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NearContractStorageEntry>
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
	import NearContractStorageEntryView from '$/views/NearContractStorageEntryView.svelte'
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
					keyBase64: true,
					valueHash: true,
					blockHeight: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(nearContractStorageEntries)}
			{@const uniqueNearContractStorageEntries = [...new Map(nearContractStorageEntries.values.map((nearContractStorageEntry) => [nearContractStorageEntry[EntityMetaKey.SelectorKey], nearContractStorageEntry])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NearContractStorageEntry}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nearContractStorageEntries.totalCount}
				getKey={(nearContractStorageEntry) => nearContractStorageEntry[EntityMetaKey.SelectorKey]}
				items={uniqueNearContractStorageEntries}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Near contract storage entries yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nearContractStorageEntry }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NearContractStorageEntry> })}
					{@const nearContractStorageEntryFields = { ...nearContractStorageEntry[EntityMetaKey.Selector], ...nearContractStorageEntry }}
					<NearContractStorageEntryView
						selection={select(EntityType.NearContractStorageEntry, nearContractStorageEntry[EntityMetaKey.Selector])}
						prefetched={nearContractStorageEntryFields}
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
		entityType={EntityType.NearContractStorageEntry}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
