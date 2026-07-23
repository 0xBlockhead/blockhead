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
		title = 'Blockhead Litecoin MWEB wallet states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebWalletStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLitecoinMwebWalletState>
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
	entityType={EntityType.BlockheadLitecoinMwebWalletState}
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
				walletId: true,
				$network: true,
				$wallet: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLitecoinMwebWalletStates) => [...new Map(blockheadLitecoinMwebWalletStates.values.map((blockheadLitecoinMwebWalletState) => [blockheadLitecoinMwebWalletState[EntityMetaKey.SelectorKey], blockheadLitecoinMwebWalletState])).values()]}
	getKey={(blockheadLitecoinMwebWalletState) => blockheadLitecoinMwebWalletState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead litecoin mweb wallet states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLitecoinMwebWalletState })}
		{@const blockheadLitecoinMwebWalletStateFields = { ...blockheadLitecoinMwebWalletState[EntityMetaKey.Selector], ...blockheadLitecoinMwebWalletState }}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebWalletState}
			entitySelector={blockheadLitecoinMwebWalletState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLitecoinMwebWalletStateFields.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead litecoin mweb wallet state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadLitecoinMwebWalletStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadLitecoinMwebWalletStateFields.$network.caip2 == null ? '' : String(`${(blockheadLitecoinMwebWalletStateFields.$network.caip2).namespace}:${(blockheadLitecoinMwebWalletStateFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadLitecoinMwebWalletStateFields.$wallet.name) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
