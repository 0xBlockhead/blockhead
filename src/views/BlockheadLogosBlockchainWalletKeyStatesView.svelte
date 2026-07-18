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
		title = 'Blockhead Logos blockchain wallet key states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLogosBlockchainWalletKeyState>
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
	import BlockheadLogosBlockchainWalletKeyStateView from '$/views/BlockheadLogosBlockchainWalletKeyStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
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
				publicKey: true,
				$nodeState: true,
			},
		})
	}
	getResourceItems={(blockheadLogosBlockchainWalletKeyStates) => [...new Map(blockheadLogosBlockchainWalletKeyStates.values.map((blockheadLogosBlockchainWalletKeyState) => [blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyState])).values()]}
	getKey={(blockheadLogosBlockchainWalletKeyState) => blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain wallet key states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyState })}
		{@const blockheadLogosBlockchainWalletKeyStateFields = { ...blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyState }}
		{@const selection = select(EntityType.BlockheadLogosBlockchainWalletKeyState, blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLogosBlockchainWalletKeyStateView
			selection={selection}
			prefetched={blockheadLogosBlockchainWalletKeyStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
