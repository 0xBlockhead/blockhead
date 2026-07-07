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
		title = 'Blockhead Logos blockchain wallet key state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp>
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
	import BlockheadLogosBlockchainWalletKeyState_TimestampView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampView.svelte'
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
					balance: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadLogosBlockchainWalletKeyStateTimestamps)}
			{@const uniqueBlockheadLogosBlockchainWalletKeyStateTimestamps = [...new Map(blockheadLogosBlockchainWalletKeyStateTimestamps.values.map((blockheadLogosBlockchainWalletKeyStateTimestamp) => [blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLogosBlockchainWalletKeyStateTimestamps.totalCount}
				getKey={(blockheadLogosBlockchainWalletKeyStateTimestamp) => blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLogosBlockchainWalletKeyStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Logos blockchain wallet key state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLogosBlockchainWalletKeyStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp> })}
					{@const blockheadLogosBlockchainWalletKeyStateTimestampFields = { ...blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyStateTimestamp }}
					<BlockheadLogosBlockchainWalletKeyState_TimestampView
						selection={select(EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp, blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadLogosBlockchainWalletKeyStateTimestampFields}
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
		entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
