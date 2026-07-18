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
		title = 'Aptos transaction observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AptosTransaction_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AptosTransaction_Timestamp>
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
	import AptosTransaction_TimestampView from '$/views/AptosTransaction_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTransaction_Timestamp}
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
				ledgerVersion: true,
				success: true,
				vmStatus: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(aptosTransactionTimestamps) => [...new Map(aptosTransactionTimestamps.values.map((aptosTransactionTimestamp) => [aptosTransactionTimestamp[EntityMetaKey.SelectorKey], aptosTransactionTimestamp])).values()]}
	getKey={(aptosTransactionTimestamp) => aptosTransactionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Aptos transaction observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aptosTransactionTimestamp })}
		{@const aptosTransactionTimestampFields = { ...aptosTransactionTimestamp[EntityMetaKey.Selector], ...aptosTransactionTimestamp }}
		{@const selection = select(EntityType.AptosTransaction_Timestamp, aptosTransactionTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AptosTransaction_TimestampView
			selection={selection}
			prefetched={aptosTransactionTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
