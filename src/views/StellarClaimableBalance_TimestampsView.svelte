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
		title = 'Stellar claimable balance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StellarClaimableBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.StellarClaimableBalance_Timestamp>
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
	import StellarClaimableBalance_TimestampView from '$/views/StellarClaimableBalance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarClaimableBalance_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(stellarClaimableBalanceTimestamps) => [...new Map(stellarClaimableBalanceTimestamps.values.map((stellarClaimableBalanceTimestamp) => [stellarClaimableBalanceTimestamp[EntityMetaKey.SelectorKey], stellarClaimableBalanceTimestamp])).values()]}
	getKey={(stellarClaimableBalanceTimestamp) => stellarClaimableBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Stellar claimable balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: stellarClaimableBalanceTimestamp })}
		{@const stellarClaimableBalanceTimestampFields = { ...stellarClaimableBalanceTimestamp[EntityMetaKey.Selector], ...stellarClaimableBalanceTimestamp }}
		{@const selection = select(EntityType.StellarClaimableBalance_Timestamp, stellarClaimableBalanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<StellarClaimableBalance_TimestampView
			selection={selection}
			prefetched={stellarClaimableBalanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
