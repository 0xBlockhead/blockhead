<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead state channel deposits',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelDeposits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadStateChannelDeposit>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$account: true,
					$network: true,
					$channel: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadStateChannelDeposits)}
			{@const uniqueBlockheadStateChannelDeposits = [...new Map(blockheadStateChannelDeposits.values.map((blockheadStateChannelDeposit) => [blockheadStateChannelDeposit[EntityMetaKey.SelectorKey], blockheadStateChannelDeposit])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadStateChannelDeposit}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadStateChannelDeposits.totalCount}
				getKey={(blockheadStateChannelDeposit) => blockheadStateChannelDeposit[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadStateChannelDeposits}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead state channel deposits yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadStateChannelDeposit }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadStateChannelDeposit> })}
					{@const blockheadStateChannelDepositFields = { ...blockheadStateChannelDeposit[EntityMetaKey.Selector], ...blockheadStateChannelDeposit }}
					<BlockheadStateChannelDepositView
						selection={select(EntityType.BlockheadStateChannelDeposit, blockheadStateChannelDeposit[EntityMetaKey.Selector])}
						prefetched={blockheadStateChannelDepositFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadStateChannelDeposit}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
