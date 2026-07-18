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
		title = 'Blockhead Lightning channel states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningChannelStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLightningChannelState>
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
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningChannelState}
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
				$channel: true,
				$localNodeState: true,
				private: true,
			},
		})
	}
	getResourceItems={(blockheadLightningChannelStates) => [...new Map(blockheadLightningChannelStates.values.map((blockheadLightningChannelState) => [blockheadLightningChannelState[EntityMetaKey.SelectorKey], blockheadLightningChannelState])).values()]}
	getKey={(blockheadLightningChannelState) => blockheadLightningChannelState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning channel states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningChannelState })}
		{@const blockheadLightningChannelStateFields = { ...blockheadLightningChannelState[EntityMetaKey.Selector], ...blockheadLightningChannelState }}
		{@const selection = select(EntityType.BlockheadLightningChannelState, blockheadLightningChannelState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLightningChannelStateView
			selection={selection}
			prefetched={blockheadLightningChannelStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
