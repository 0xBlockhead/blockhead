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
		title = 'TON contract get method observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TonContractGetMethod_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TonContractGetMethod_Timestamp>
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
	import TonContractGetMethod_TimestampView from '$/views/TonContractGetMethod_TimestampView.svelte'
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
				entityType={EntityType.TonContractGetMethod_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(tonContractGetMethodTimestamps)}
			{@const uniqueTonContractGetMethodTimestamps = [...new Map(tonContractGetMethodTimestamps.values.map((tonContractGetMethodTimestamp) => [tonContractGetMethodTimestamp[EntityMetaKey.SelectorKey], tonContractGetMethodTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TonContractGetMethod_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tonContractGetMethodTimestamps.totalCount}
				getKey={(tonContractGetMethodTimestamp) => tonContractGetMethodTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueTonContractGetMethodTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No TON contract get method observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tonContractGetMethodTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TonContractGetMethod_Timestamp> })}
					{@const tonContractGetMethodTimestampFields = { ...tonContractGetMethodTimestamp[EntityMetaKey.Selector], ...tonContractGetMethodTimestamp }}
					<TonContractGetMethod_TimestampView
						selection={select(EntityType.TonContractGetMethod_Timestamp, tonContractGetMethodTimestamp[EntityMetaKey.Selector])}
						prefetched={tonContractGetMethodTimestampFields}
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
		entityType={EntityType.TonContractGetMethod_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
