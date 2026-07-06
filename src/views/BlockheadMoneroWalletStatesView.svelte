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
		title = 'Blockhead Monero wallet states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroWalletStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadMoneroWalletState>
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
	import BlockheadMoneroWalletStateView from '$/views/BlockheadMoneroWalletStateView.svelte'
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
					walletId: true,
					primaryAddress: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroWalletState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadMoneroWalletStates)}
			{@const uniqueBlockheadMoneroWalletStates = [...new Map(blockheadMoneroWalletStates.values.map((blockheadMoneroWalletState) => [blockheadMoneroWalletState[EntityMetaKey.SelectorKey], blockheadMoneroWalletState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroWalletState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadMoneroWalletStates.totalCount}
				getKey={(blockheadMoneroWalletState) => blockheadMoneroWalletState[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadMoneroWalletStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead monero wallet states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadMoneroWalletState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadMoneroWalletState> })}
					{@const blockheadMoneroWalletStateFields = { ...blockheadMoneroWalletState[EntityMetaKey.Selector], ...blockheadMoneroWalletState }}
					<BlockheadMoneroWalletStateView
						selection={select(EntityType.BlockheadMoneroWalletState, blockheadMoneroWalletState[EntityMetaKey.Selector])}
						prefetched={blockheadMoneroWalletStateFields}
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
		entityType={EntityType.BlockheadMoneroWalletState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
