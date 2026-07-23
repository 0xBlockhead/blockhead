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
		title = 'Blockhead Monero wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadMoneroWalletState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
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
				balanceAtomicUnits: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadMoneroWalletStateTimestamps) => [...new Map(blockheadMoneroWalletStateTimestamps.values.map((blockheadMoneroWalletStateTimestamp) => [blockheadMoneroWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroWalletStateTimestamp])).values()]}
	getKey={(blockheadMoneroWalletStateTimestamp) => blockheadMoneroWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroWalletStateTimestamp })}
		{@const blockheadMoneroWalletStateTimestampFields = { ...blockheadMoneroWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroWalletStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
			entitySelector={blockheadMoneroWalletStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadMoneroWalletStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero wallet state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadMoneroWalletStateTimestampFields.balanceAtomicUnits) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadMoneroWalletStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
