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
		title = 'Blockhead Monero wallet states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroWalletStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadMoneroWalletState>
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
	entityType={EntityType.BlockheadMoneroWalletState}
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
				primaryAddress: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadMoneroWalletStates) => [...new Map(blockheadMoneroWalletStates.values.map((blockheadMoneroWalletState) => [blockheadMoneroWalletState[EntityMetaKey.SelectorKey], blockheadMoneroWalletState])).values()]}
	getKey={(blockheadMoneroWalletState) => blockheadMoneroWalletState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero wallet states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroWalletState })}
		{@const blockheadMoneroWalletStateFields = { ...blockheadMoneroWalletState[EntityMetaKey.Selector], ...blockheadMoneroWalletState }}
		<EntityView
			entityType={EntityType.BlockheadMoneroWalletState}
			entitySelector={blockheadMoneroWalletState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadMoneroWalletStateFields.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead monero wallet state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadMoneroWalletStateFields.primaryAddress) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[[String((blockheadMoneroWalletStateFields.$network.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadMoneroWalletStateFields.$network.$network.caip2 == null ? '' : String(`${(blockheadMoneroWalletStateFields.$network.$network.caip2).namespace}:${(blockheadMoneroWalletStateFields.$network.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'monero network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
