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
		title = 'Bnb beacon transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BnbBeaconTransaction>
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
	entityType={EntityType.BnbBeaconTransaction}
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
				txHash: true,
				txType: true,
				tokenSymbol: true,
				$block: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bnbBeaconTransactions) => [...new Map(bnbBeaconTransactions.values.map((bnbBeaconTransaction) => [bnbBeaconTransaction[EntityMetaKey.SelectorKey], bnbBeaconTransaction])).values()]}
	getKey={(bnbBeaconTransaction) => bnbBeaconTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconTransaction })}
		{@const bnbBeaconTransactionFields = { ...bnbBeaconTransaction[EntityMetaKey.Selector], ...bnbBeaconTransaction }}
		<EntityView
			entityType={EntityType.BnbBeaconTransaction}
			entitySelector={bnbBeaconTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bnbBeaconTransactionFields.txHash) ?? '')].filter(Boolean).join(' ') || 'bnb beacon transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((bnbBeaconTransactionFields.txType) ?? ''), String((bnbBeaconTransactionFields.tokenSymbol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((bnbBeaconTransactionFields.$block.height) ?? '')].filter(Boolean).join(' ') || [String((bnbBeaconTransactionFields.$block.hash) ?? '')].filter(Boolean).join(' ') || 'bnb beacon block'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
