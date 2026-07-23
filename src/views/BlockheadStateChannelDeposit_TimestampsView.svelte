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
		title = 'Blockhead state channel deposit observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelDeposit_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadStateChannelDeposit_Timestamp>
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
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
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
				source: true,
				availableBalance: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadStateChannelDepositTimestamps) => [...new Map(blockheadStateChannelDepositTimestamps.values.map((blockheadStateChannelDepositTimestamp) => [blockheadStateChannelDepositTimestamp[EntityMetaKey.SelectorKey], blockheadStateChannelDepositTimestamp])).values()]}
	getKey={(blockheadStateChannelDepositTimestamp) => blockheadStateChannelDepositTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel deposit observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelDepositTimestamp })}
		{@const blockheadStateChannelDepositTimestampFields = { ...blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector], ...blockheadStateChannelDepositTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
			entitySelector={blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadStateChannelDepositTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel deposit timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadStateChannelDepositTimestampFields.source) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadStateChannelDepositTimestampFields.availableBalance) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
