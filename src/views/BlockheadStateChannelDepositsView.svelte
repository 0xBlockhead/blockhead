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
		title = 'Blockhead state channel deposits',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelDeposits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadStateChannelDeposit>
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
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelDeposit}
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
				$account: true,
				$network: true,
				$channel: true,
			},
		})
	}
	getResourceItems={(blockheadStateChannelDeposits) => [...new Map(blockheadStateChannelDeposits.values.map((blockheadStateChannelDeposit) => [blockheadStateChannelDeposit[EntityMetaKey.SelectorKey], blockheadStateChannelDeposit])).values()]}
	getKey={(blockheadStateChannelDeposit) => blockheadStateChannelDeposit[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel deposits yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelDeposit })}
		{@const blockheadStateChannelDepositFields = { ...blockheadStateChannelDeposit[EntityMetaKey.Selector], ...blockheadStateChannelDeposit }}
		{@const selection = select(EntityType.BlockheadStateChannelDeposit, blockheadStateChannelDeposit[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadStateChannelDepositView
			selection={selection}
			prefetched={blockheadStateChannelDepositFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
