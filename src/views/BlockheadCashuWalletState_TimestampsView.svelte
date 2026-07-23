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
		title = 'Blockhead Cashu wallet state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuWalletState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuWalletState_Timestamp>
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
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
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
				balance: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuWalletStateTimestamps) => [...new Map(blockheadCashuWalletStateTimestamps.values.map((blockheadCashuWalletStateTimestamp) => [blockheadCashuWalletStateTimestamp[EntityMetaKey.SelectorKey], blockheadCashuWalletStateTimestamp])).values()]}
	getKey={(blockheadCashuWalletStateTimestamp) => blockheadCashuWalletStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu wallet state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuWalletStateTimestamp })}
		{@const blockheadCashuWalletStateTimestampFields = { ...blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector], ...blockheadCashuWalletStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadCashuWalletState_Timestamp}
			entitySelector={blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuWalletStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu wallet state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((blockheadCashuWalletStateTimestampFields.balance) ?? '') ? String((blockheadCashuWalletStateTimestampFields.balance) ?? '') + blockheadCashuWalletStateTimestampFields.$walletState.unit : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCashuWalletStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
