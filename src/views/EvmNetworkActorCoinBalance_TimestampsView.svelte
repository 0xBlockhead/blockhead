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
		title = 'Balance observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkActorCoinBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetworkActorCoinBalance_Timestamp>
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
	import EvmNetworkActorCoinBalance_TimestampView from '$/views/EvmNetworkActorCoinBalance_TimestampView.svelte'
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
					source: true,
					balance: true,
					usdValue: true,
					blockNumber: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkActorCoinBalanceTimestamps)}
			{@const uniqueEvmNetworkActorCoinBalanceTimestamps = [...new Map(evmNetworkActorCoinBalanceTimestamps.values.map((evmNetworkActorCoinBalanceTimestamp) => [evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.SelectorKey], evmNetworkActorCoinBalanceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkActorCoinBalanceTimestamps.totalCount}
				getKey={(evmNetworkActorCoinBalanceTimestamp) => evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkActorCoinBalanceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network actor coin balance observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkActorCoinBalanceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetworkActorCoinBalance_Timestamp> })}
					{@const evmNetworkActorCoinBalanceTimestampFields = { ...evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector], ...evmNetworkActorCoinBalanceTimestamp }}
					<EvmNetworkActorCoinBalance_TimestampView
						selection={select(EntityType.EvmNetworkActorCoinBalance_Timestamp, evmNetworkActorCoinBalanceTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmNetworkActorCoinBalanceTimestampFields}
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
		entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
