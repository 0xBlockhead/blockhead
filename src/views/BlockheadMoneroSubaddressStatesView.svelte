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
		title = 'Blockhead Monero subaddress states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroSubaddressStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadMoneroSubaddressState>
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
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroSubaddressState}
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
				address: true,
				accountIndex: true,
				addressIndex: true,
				walletId: true,
				label: true,
			},
		})
	}
	getResourceItems={(blockheadMoneroSubaddressStates) => [...new Map(blockheadMoneroSubaddressStates.values.map((blockheadMoneroSubaddressState) => [blockheadMoneroSubaddressState[EntityMetaKey.SelectorKey], blockheadMoneroSubaddressState])).values()]}
	getKey={(blockheadMoneroSubaddressState) => blockheadMoneroSubaddressState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero subaddress states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroSubaddressState })}
		{@const blockheadMoneroSubaddressStateFields = { ...blockheadMoneroSubaddressState[EntityMetaKey.Selector], ...blockheadMoneroSubaddressState }}
		{@const selection = select(EntityType.BlockheadMoneroSubaddressState, blockheadMoneroSubaddressState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadMoneroSubaddressStateView
			selection={selection}
			prefetched={blockheadMoneroSubaddressStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
