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
		title = 'Bittensor network observations',
		typeAnnotationParagraphs = ['A point-in-time runtime and subsystem observation for a Bittensor network.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BittensorNetwork_Timestamp>
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
	import BittensorNetwork_TimestampView from '$/views/BittensorNetwork_TimestampView.svelte'
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
					finalizedBlockNumber: true,
					runtimeSpecName: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(bittensorNetworkTimestamps)}
			{@const uniqueBittensorNetworkTimestamps = [...new Map(bittensorNetworkTimestamps.values.map((bittensorNetworkTimestamp) => [bittensorNetworkTimestamp[EntityMetaKey.SelectorKey], bittensorNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BittensorNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bittensorNetworkTimestamps.totalCount}
				getKey={(bittensorNetworkTimestamp) => bittensorNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBittensorNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bittensor network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bittensorNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BittensorNetwork_Timestamp> })}
					{@const bittensorNetworkTimestampFields = { ...bittensorNetworkTimestamp[EntityMetaKey.Selector], ...bittensorNetworkTimestamp }}
					<BittensorNetwork_TimestampView
						selection={select(EntityType.BittensorNetwork_Timestamp, bittensorNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={bittensorNetworkTimestampFields}
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
		entityType={EntityType.BittensorNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
