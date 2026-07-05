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
		title = 'Tron account token balance observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TronAccountTokenBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TronAccountTokenBalance_Timestamp>
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
	import TronAccountTokenBalance_TimestampView from '$/views/TronAccountTokenBalance_TimestampView.svelte'
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
		{#snippet children(tronAccountTokenBalanceTimestamps)}
			{@const uniqueTronAccountTokenBalanceTimestamps = [...new Map(tronAccountTokenBalanceTimestamps.values.map((tronAccountTokenBalanceTimestamp) => [tronAccountTokenBalanceTimestamp[EntityMetaKey.SelectorKey], tronAccountTokenBalanceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TronAccountTokenBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tronAccountTokenBalanceTimestamps.totalCount}
				getKey={(tronAccountTokenBalanceTimestamp) => tronAccountTokenBalanceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueTronAccountTokenBalanceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Tron account token balance observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tronAccountTokenBalanceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TronAccountTokenBalance_Timestamp> })}
					{@const tronAccountTokenBalanceTimestampFields = { ...tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector], ...tronAccountTokenBalanceTimestamp }}
					<TronAccountTokenBalance_TimestampView
						selection={select(EntityType.TronAccountTokenBalance_Timestamp, tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector])}
						prefetched={tronAccountTokenBalanceTimestampFields}
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
		entityType={EntityType.TronAccountTokenBalance_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
