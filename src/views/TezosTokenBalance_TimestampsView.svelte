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
		title = 'Tezos token balance observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TezosTokenBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TezosTokenBalance_Timestamp>
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
	import TezosTokenBalance_TimestampView from '$/views/TezosTokenBalance_TimestampView.svelte'
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
				entityType={EntityType.TezosTokenBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(tezosTokenBalanceTimestamps)}
			{@const uniqueTezosTokenBalanceTimestamps = [...new Map(tezosTokenBalanceTimestamps.values.map((tezosTokenBalanceTimestamp) => [tezosTokenBalanceTimestamp[EntityMetaKey.SelectorKey], tezosTokenBalanceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TezosTokenBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tezosTokenBalanceTimestamps.totalCount}
				getKey={(tezosTokenBalanceTimestamp) => tezosTokenBalanceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueTezosTokenBalanceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Tezos token balance observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tezosTokenBalanceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TezosTokenBalance_Timestamp> })}
					{@const tezosTokenBalanceTimestampFields = { ...tezosTokenBalanceTimestamp[EntityMetaKey.Selector], ...tezosTokenBalanceTimestamp }}
					<TezosTokenBalance_TimestampView
						selection={select(EntityType.TezosTokenBalance_Timestamp, tezosTokenBalanceTimestamp[EntityMetaKey.Selector])}
						prefetched={tezosTokenBalanceTimestampFields}
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
		entityType={EntityType.TezosTokenBalance_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
