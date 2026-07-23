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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AptosCoinBalance_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.AptosCoinBalance_Timestamp}
			entitySelector={aptosCoinBalanceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aptosCoinBalanceTimestampFields.assetType) ?? '')].filter(Boolean).join(' ') || 'current Aptos coin balance observation'}
			{/snippet}

			{#snippet Value()}
				{[(String((aptosCoinBalanceTimestampFields.amount) ?? '') ? String((aptosCoinBalanceTimestampFields.amount) ?? '') + aptosCoinBalanceTimestampFields.unit : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aptosCoinBalanceTimestampFields.ledgerVersion) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
