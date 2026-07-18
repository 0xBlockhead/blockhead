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
		title = 'Solana transaction observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTransaction_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaTransaction_Timestamp>
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
	import SolanaTransaction_TimestampView from '$/views/SolanaTransaction_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTransaction_Timestamp}
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
				slot: true,
				status: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(solanaTransactionTimestamps) => [...new Map(solanaTransactionTimestamps.values.map((solanaTransactionTimestamp) => [solanaTransactionTimestamp[EntityMetaKey.SelectorKey], solanaTransactionTimestamp])).values()]}
	getKey={(solanaTransactionTimestamp) => solanaTransactionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana transaction observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTransactionTimestamp })}
		{@const solanaTransactionTimestampFields = { ...solanaTransactionTimestamp[EntityMetaKey.Selector], ...solanaTransactionTimestamp }}
		{@const selection = select(EntityType.SolanaTransaction_Timestamp, solanaTransactionTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SolanaTransaction_TimestampView
			selection={selection}
			prefetched={solanaTransactionTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
