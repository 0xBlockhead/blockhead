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
		title = 'Solana token mint observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTokenMint_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaTokenMint_Timestamp>
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
	import SolanaTokenMint_TimestampView from '$/views/SolanaTokenMint_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenMint_Timestamp}
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
				supply: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(solanaTokenMintTimestamps) => [...new Map(solanaTokenMintTimestamps.values.map((solanaTokenMintTimestamp) => [solanaTokenMintTimestamp[EntityMetaKey.SelectorKey], solanaTokenMintTimestamp])).values()]}
	getKey={(solanaTokenMintTimestamp) => solanaTokenMintTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana token mint observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTokenMintTimestamp })}
		{@const solanaTokenMintTimestampFields = { ...solanaTokenMintTimestamp[EntityMetaKey.Selector], ...solanaTokenMintTimestamp }}
		{@const selection = select(EntityType.SolanaTokenMint_Timestamp, solanaTokenMintTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SolanaTokenMint_TimestampView
			selection={selection}
			prefetched={solanaTokenMintTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
