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
		title = 'Blockhead Cashu wallet states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuWalletStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuWalletState>
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
	entityType={EntityType.BlockheadCashuWalletState}
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
				unit: true,
				$mint: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuWalletStates) => [...new Map(blockheadCashuWalletStates.values.map((blockheadCashuWalletState) => [blockheadCashuWalletState[EntityMetaKey.SelectorKey], blockheadCashuWalletState])).values()]}
	getKey={(blockheadCashuWalletState) => blockheadCashuWalletState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu wallet states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuWalletState })}
		{@const blockheadCashuWalletStateFields = { ...blockheadCashuWalletState[EntityMetaKey.Selector], ...blockheadCashuWalletState }}
		<EntityView
			entityType={EntityType.BlockheadCashuWalletState}
			entitySelector={blockheadCashuWalletState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuWalletStateFields.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu wallet state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCashuWalletStateFields.unit) ?? ''), [String((blockheadCashuWalletStateFields.$mint.mintUrl) ?? '')].filter(Boolean).join(' ') || 'Cashu mint'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
