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
		title = 'Blockhead Litecoin MWEB wallet states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebWalletStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLitecoinMwebWalletState>
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
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
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
					$network: true,
					$wallet: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadLitecoinMwebWalletStates)}
			{@const uniqueBlockheadLitecoinMwebWalletStates = [...new Map(blockheadLitecoinMwebWalletStates.values.map((blockheadLitecoinMwebWalletState) => [blockheadLitecoinMwebWalletState[EntityMetaKey.SelectorKey], blockheadLitecoinMwebWalletState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLitecoinMwebWalletState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLitecoinMwebWalletStates.totalCount}
				getKey={(blockheadLitecoinMwebWalletState) => blockheadLitecoinMwebWalletState[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLitecoinMwebWalletStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead litecoin mweb wallet states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLitecoinMwebWalletState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLitecoinMwebWalletState> })}
					{@const blockheadLitecoinMwebWalletStateFields = { ...blockheadLitecoinMwebWalletState[EntityMetaKey.Selector], ...blockheadLitecoinMwebWalletState }}
					<BlockheadLitecoinMwebWalletStateView
						selection={select(EntityType.BlockheadLitecoinMwebWalletState, blockheadLitecoinMwebWalletState[EntityMetaKey.Selector])}
						prefetched={blockheadLitecoinMwebWalletStateFields}
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
		entityType={EntityType.BlockheadLitecoinMwebWalletState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
