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
		title = 'Eigen layer delegation observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerDelegation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EigenLayerDelegation_Timestamp>
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
	import EigenLayerDelegation_TimestampView from '$/views/EigenLayerDelegation_TimestampView.svelte'
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
					$staker: true,
					$operator: true,
					$strategy: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerDelegation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(eigenLayerDelegationTimestamps)}
			{@const uniqueEigenLayerDelegationTimestamps = [...new Map(eigenLayerDelegationTimestamps.values.map((eigenLayerDelegationTimestamp) => [eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey], eigenLayerDelegationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerDelegation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eigenLayerDelegationTimestamps.totalCount}
				getKey={(eigenLayerDelegationTimestamp) => eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEigenLayerDelegationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Eigen layer delegation observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eigenLayerDelegationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EigenLayerDelegation_Timestamp> })}
					{@const eigenLayerDelegationTimestampFields = { ...eigenLayerDelegationTimestamp[EntityMetaKey.Selector], ...eigenLayerDelegationTimestamp }}
					<EigenLayerDelegation_TimestampView
						selection={select(EntityType.EigenLayerDelegation_Timestamp, eigenLayerDelegationTimestamp[EntityMetaKey.Selector])}
						prefetched={eigenLayerDelegationTimestampFields}
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
		entityType={EntityType.EigenLayerDelegation_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
