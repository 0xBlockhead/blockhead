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
		title = 'Asset balance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAssetBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotAssetBalance_Timestamp>
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
	import PolkadotAssetBalance_TimestampView from '$/views/PolkadotAssetBalance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
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
				$asset: true,
				freeBalancePlancks: true,
				status: true,
			},
		})
	}
	getResourceItems={(polkadotAssetBalanceTimestamps) => [...new Map(polkadotAssetBalanceTimestamps.values.map((polkadotAssetBalanceTimestamp) => [polkadotAssetBalanceTimestamp[EntityMetaKey.SelectorKey], polkadotAssetBalanceTimestamp])).values()]}
	getKey={(polkadotAssetBalanceTimestamp) => polkadotAssetBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot asset balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotAssetBalanceTimestamp })}
		{@const polkadotAssetBalanceTimestampFields = { ...polkadotAssetBalanceTimestamp[EntityMetaKey.Selector], ...polkadotAssetBalanceTimestamp }}
		{@const selection = select(EntityType.PolkadotAssetBalance_Timestamp, polkadotAssetBalanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<PolkadotAssetBalance_TimestampView
			selection={selection}
			prefetched={polkadotAssetBalanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
