<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLitecoinMwebWalletState>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
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
		{@const selection = select(EntityType.BlockheadLitecoinMwebWalletState, blockheadLitecoinMwebWalletState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLitecoinMwebWalletStateView
			selection={selection}
			prefetched={blockheadLitecoinMwebWalletStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
