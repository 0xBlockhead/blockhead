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
		title = 'Asset balance observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAssetBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotAssetBalance_Timestamp>
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
	import PolkadotAssetBalance_TimestampView from '$/views/PolkadotAssetBalance_TimestampView.svelte'
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
					$asset: true,
					freeBalancePlancks: true,
					status: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(polkadotAssetBalanceTimestamps)}
			{@const uniquePolkadotAssetBalanceTimestamps = [...new Map(polkadotAssetBalanceTimestamps.values.map((polkadotAssetBalanceTimestamp) => [polkadotAssetBalanceTimestamp[EntityMetaKey.SelectorKey], polkadotAssetBalanceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotAssetBalance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotAssetBalanceTimestamps.totalCount}
				getKey={(polkadotAssetBalanceTimestamp) => polkadotAssetBalanceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotAssetBalanceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot asset balance observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotAssetBalanceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotAssetBalance_Timestamp> })}
					{@const polkadotAssetBalanceTimestampFields = { ...polkadotAssetBalanceTimestamp[EntityMetaKey.Selector], ...polkadotAssetBalanceTimestamp }}
					<PolkadotAssetBalance_TimestampView
						selection={select(EntityType.PolkadotAssetBalance_Timestamp, polkadotAssetBalanceTimestamp[EntityMetaKey.Selector])}
						prefetched={polkadotAssetBalanceTimestampFields}
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
		entityType={EntityType.PolkadotAssetBalance_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
