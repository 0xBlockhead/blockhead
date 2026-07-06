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
		title = 'dYdX chain subaccount observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainSubaccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.DydxChainSubaccount_Timestamp>
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
	import DydxChainSubaccount_TimestampView from '$/views/DydxChainSubaccount_TimestampView.svelte'
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
					$subaccount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DydxChainSubaccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(dydxChainSubaccountTimestamps)}
			{@const uniqueDydxChainSubaccountTimestamps = [...new Map(dydxChainSubaccountTimestamps.values.map((dydxChainSubaccountTimestamp) => [dydxChainSubaccountTimestamp[EntityMetaKey.SelectorKey], dydxChainSubaccountTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DydxChainSubaccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={dydxChainSubaccountTimestamps.totalCount}
				getKey={(dydxChainSubaccountTimestamp) => dydxChainSubaccountTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueDydxChainSubaccountTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Dydx chain subaccount observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: dydxChainSubaccountTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.DydxChainSubaccount_Timestamp> })}
					{@const dydxChainSubaccountTimestampFields = { ...dydxChainSubaccountTimestamp[EntityMetaKey.Selector], ...dydxChainSubaccountTimestamp }}
					<DydxChainSubaccount_TimestampView
						selection={select(EntityType.DydxChainSubaccount_Timestamp, dydxChainSubaccountTimestamp[EntityMetaKey.Selector])}
						prefetched={dydxChainSubaccountTimestampFields}
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
		entityType={EntityType.DydxChainSubaccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
