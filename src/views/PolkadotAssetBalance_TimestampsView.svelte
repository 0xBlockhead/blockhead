<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotAssetBalance_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.PolkadotAssetBalance_Timestamp}
			entitySelector={polkadotAssetBalanceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((polkadotAssetBalanceTimestampFields.$asset.assetId) ?? '')].filter(Boolean).join(' ') || 'Polkadot asset'].filter(Boolean).join(' ') || 'Polkadot asset balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotAssetBalanceTimestampFields.freeBalancePlancks) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((polkadotAssetBalanceTimestampFields.status) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
