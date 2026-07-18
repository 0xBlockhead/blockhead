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
		title = 'Blockhead wallet request calls',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletRequestCalls-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWalletRequestCall>
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
	import BlockheadWalletRequestCallView from '$/views/BlockheadWalletRequestCallView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletRequestCall}
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
				callIndex: true,
				toAddress: true,
			},
		})
	}
	getResourceItems={(blockheadWalletRequestCalls) => [...new Map(blockheadWalletRequestCalls.values.map((blockheadWalletRequestCall) => [blockheadWalletRequestCall[EntityMetaKey.SelectorKey], blockheadWalletRequestCall])).values()]}
	getKey={(blockheadWalletRequestCall) => blockheadWalletRequestCall[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet request calls yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletRequestCall })}
		{@const blockheadWalletRequestCallFields = { ...blockheadWalletRequestCall[EntityMetaKey.Selector], ...blockheadWalletRequestCall }}
		{@const selection = select(EntityType.BlockheadWalletRequestCall, blockheadWalletRequestCall[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadWalletRequestCallView
			selection={selection}
			prefetched={blockheadWalletRequestCallFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
