<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Lightning payment observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningPayment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLightningPayment_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadLightningPayment_TimestampView from '$/views/BlockheadLightningPayment_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningPayment_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				timestampMs: true,
				status: true,
				feeMsat: true,
			},
		})
	}
	getResourceItems={(blockheadLightningPaymentTimestamps) => [...new Map(blockheadLightningPaymentTimestamps.values.map((blockheadLightningPaymentTimestamp) => [blockheadLightningPaymentTimestamp[EntityMetaKey.SelectorKey], blockheadLightningPaymentTimestamp])).values()]}
	getKey={(blockheadLightningPaymentTimestamp) => blockheadLightningPaymentTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning payment observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningPaymentTimestamp })}
		{@const blockheadLightningPaymentTimestampFields = { ...blockheadLightningPaymentTimestamp[EntityMetaKey.Selector], ...blockheadLightningPaymentTimestamp }}
		{@const selection = select(EntityType.BlockheadLightningPayment_Timestamp, blockheadLightningPaymentTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLightningPayment_TimestampView
			selection={selection}
			prefetched={blockheadLightningPaymentTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
