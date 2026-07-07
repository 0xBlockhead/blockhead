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
		title = 'ICP canister metadata entries',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IcpCanisterMetadataEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.IcpCanisterMetadata>
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
	import IcpCanisterMetadataView from '$/views/IcpCanisterMetadataView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IcpCanisterMetadata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(icpCanisterMetadataEntries)}
			{@const uniqueIcpCanisterMetadataEntries = [...new Map(icpCanisterMetadataEntries.values.map((icpCanisterMetadata) => [icpCanisterMetadata[EntityMetaKey.SelectorKey], icpCanisterMetadata])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IcpCanisterMetadata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={icpCanisterMetadataEntries.totalCount}
				getKey={(icpCanisterMetadata) => icpCanisterMetadata[EntityMetaKey.SelectorKey]}
				items={uniqueIcpCanisterMetadataEntries}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ICP canister metadata entries yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: icpCanisterMetadata }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.IcpCanisterMetadata> })}
					{@const icpCanisterMetadataFields = { ...icpCanisterMetadata[EntityMetaKey.Selector], ...icpCanisterMetadata }}
					<IcpCanisterMetadataView
						selection={select(EntityType.IcpCanisterMetadata, icpCanisterMetadata[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={icpCanisterMetadataFields}
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
		entityType={EntityType.IcpCanisterMetadata}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
