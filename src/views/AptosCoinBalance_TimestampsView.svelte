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
		title = 'Current Aptos coin balance observations',
		typeAnnotationParagraphs = ['A current balance reported by the Aptos Indexer, anchored to the row\'s last transaction version. This surface does not imply retained balance history.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AptosCoinBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AptosCoinBalance_Timestamp>
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
	import AptosCoinBalance_TimestampView from '$/views/AptosCoinBalance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosCoinBalance_Timestamp}
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
				assetType: true,
				amount: true,
				ledgerVersion: true,
			},
		})
	}
	getResourceItems={(aptosCoinBalanceTimestamps) => [...new Map(aptosCoinBalanceTimestamps.values.map((aptosCoinBalanceTimestamp) => [aptosCoinBalanceTimestamp[EntityMetaKey.SelectorKey], aptosCoinBalanceTimestamp])).values()]}
	getKey={(aptosCoinBalanceTimestamp) => aptosCoinBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Current Aptos coin balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aptosCoinBalanceTimestamp })}
		{@const aptosCoinBalanceTimestampFields = { ...aptosCoinBalanceTimestamp[EntityMetaKey.Selector], ...aptosCoinBalanceTimestamp }}
		{@const selection = select(EntityType.AptosCoinBalance_Timestamp, aptosCoinBalanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AptosCoinBalance_TimestampView
			selection={selection}
			prefetched={aptosCoinBalanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
