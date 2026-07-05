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
		title = 'Bnb beacon token observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconToken_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BnbBeaconToken_Timestamp>
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
	import BnbBeaconToken_TimestampView from '$/views/BnbBeaconToken_TimestampView.svelte'
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
					totalSupply: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(bnbBeaconTokenTimestamps)}
			{@const uniqueBnbBeaconTokenTimestamps = [...new Map(bnbBeaconTokenTimestamps.values.map((bnbBeaconTokenTimestamp) => [bnbBeaconTokenTimestamp[EntityMetaKey.SelectorKey], bnbBeaconTokenTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BnbBeaconToken_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bnbBeaconTokenTimestamps.totalCount}
				getKey={(bnbBeaconTokenTimestamp) => bnbBeaconTokenTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBnbBeaconTokenTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bnb beacon token observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bnbBeaconTokenTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BnbBeaconToken_Timestamp> })}
					{@const bnbBeaconTokenTimestampFields = { ...bnbBeaconTokenTimestamp[EntityMetaKey.Selector], ...bnbBeaconTokenTimestamp }}
					<BnbBeaconToken_TimestampView
						selection={select(EntityType.BnbBeaconToken_Timestamp, bnbBeaconTokenTimestamp[EntityMetaKey.Selector])}
						prefetched={bnbBeaconTokenTimestampFields}
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
		entityType={EntityType.BnbBeaconToken_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
