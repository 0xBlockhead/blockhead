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
		title = 'Tron account token balance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TronAccountTokenBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.TronAccountTokenBalance_Timestamp>
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
	entityType={EntityType.TronAccountTokenBalance_Timestamp}
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
				tokenSymbol: true,
				balance: true,
				tokenName: true,
				tokenId: true,
				$account: true,
			},
		})
	}
	{countResource}
	getResourceItems={(tronAccountTokenBalanceTimestamps) => [...new Map(tronAccountTokenBalanceTimestamps.values.map((tronAccountTokenBalanceTimestamp) => [tronAccountTokenBalanceTimestamp[EntityMetaKey.SelectorKey], tronAccountTokenBalanceTimestamp])).values()]}
	getKey={(tronAccountTokenBalanceTimestamp) => tronAccountTokenBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Tron account token balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: tronAccountTokenBalanceTimestamp })}
		{@const tronAccountTokenBalanceTimestampFields = { ...tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector], ...tronAccountTokenBalanceTimestamp }}
		<EntityView
			entityType={EntityType.TronAccountTokenBalance_Timestamp}
			entitySelector={tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((tronAccountTokenBalanceTimestampFields.tokenSymbol) ?? '')].filter(Boolean).join(' ') || [String((tronAccountTokenBalanceTimestampFields.tokenName) ?? ''), String((tronAccountTokenBalanceTimestampFields.tokenId) ?? '')].filter(Boolean).join(' ') || 'tron account token balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((tronAccountTokenBalanceTimestampFields.balance) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((tronAccountTokenBalanceTimestampFields.$account.address) ?? '')].filter(Boolean).join(' ') || 'tron account'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
