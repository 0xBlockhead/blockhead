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
		title = 'Blockhead Logos blockchain wallet key state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp>
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
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
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
	getResourceItems={(blockheadLogosBlockchainWalletKeyStateTimestamps) => [...new Map(blockheadLogosBlockchainWalletKeyStateTimestamps.values.map((blockheadLogosBlockchainWalletKeyStateTimestamp) => [blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyStateTimestamp])).values()]}
	getKey={(blockheadLogosBlockchainWalletKeyStateTimestamp) => blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain wallet key state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyStateTimestamp })}
		{@const blockheadLogosBlockchainWalletKeyStateTimestampFields = { ...blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
			entitySelector={blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLogosBlockchainWalletKeyStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain wallet key state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLogosBlockchainWalletKeyStateTimestampFields.balance) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLogosBlockchainWalletKeyStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
