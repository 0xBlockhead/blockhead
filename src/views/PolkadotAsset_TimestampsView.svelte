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
		title = 'Asset observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotAsset_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotAsset_Timestamp>
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
	import PolkadotAsset_TimestampView from '$/views/PolkadotAsset_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAsset_Timestamp}
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
				symbol: true,
				name: true,
				status: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(polkadotAssetTimestamps) => [...new Map(polkadotAssetTimestamps.values.map((polkadotAssetTimestamp) => [polkadotAssetTimestamp[EntityMetaKey.SelectorKey], polkadotAssetTimestamp])).values()]}
	getKey={(polkadotAssetTimestamp) => polkadotAssetTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot asset observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotAssetTimestamp })}
		{@const polkadotAssetTimestampFields = { ...polkadotAssetTimestamp[EntityMetaKey.Selector], ...polkadotAssetTimestamp }}
		{@const selection = select(EntityType.PolkadotAsset_Timestamp, polkadotAssetTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<PolkadotAsset_TimestampView
			selection={selection}
			prefetched={polkadotAssetTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
