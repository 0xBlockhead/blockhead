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
		title = 'Avalanche subnet observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheSubnet_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AvalancheSubnet_Timestamp>
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
	import AvalancheSubnet_TimestampView from '$/views/AvalancheSubnet_TimestampView.svelte'
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
					validatorCount: true,
					delegatorCount: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AvalancheSubnet_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(avalancheSubnetTimestamps)}
			{@const uniqueAvalancheSubnetTimestamps = [...new Map(avalancheSubnetTimestamps.values.map((avalancheSubnetTimestamp) => [avalancheSubnetTimestamp[EntityMetaKey.SelectorKey], avalancheSubnetTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AvalancheSubnet_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={avalancheSubnetTimestamps.totalCount}
				getKey={(avalancheSubnetTimestamp) => avalancheSubnetTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAvalancheSubnetTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Avalanche subnet observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: avalancheSubnetTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AvalancheSubnet_Timestamp> })}
					{@const avalancheSubnetTimestampFields = { ...avalancheSubnetTimestamp[EntityMetaKey.Selector], ...avalancheSubnetTimestamp }}
					<AvalancheSubnet_TimestampView
						selection={select(EntityType.AvalancheSubnet_Timestamp, avalancheSubnetTimestamp[EntityMetaKey.Selector])}
						prefetched={avalancheSubnetTimestampFields}
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
		entityType={EntityType.AvalancheSubnet_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
