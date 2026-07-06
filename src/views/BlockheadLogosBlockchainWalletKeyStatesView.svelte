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
		title = 'Blockhead Logos blockchain wallet key states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainWalletKeyStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLogosBlockchainWalletKeyState>
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
	import BlockheadLogosBlockchainWalletKeyStateView from '$/views/BlockheadLogosBlockchainWalletKeyStateView.svelte'
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
					publicKey: true,
					$nodeState: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadLogosBlockchainWalletKeyStates)}
			{@const uniqueBlockheadLogosBlockchainWalletKeyStates = [...new Map(blockheadLogosBlockchainWalletKeyStates.values.map((blockheadLogosBlockchainWalletKeyState) => [blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey], blockheadLogosBlockchainWalletKeyState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLogosBlockchainWalletKeyStates.totalCount}
				getKey={(blockheadLogosBlockchainWalletKeyState) => blockheadLogosBlockchainWalletKeyState[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLogosBlockchainWalletKeyStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Logos blockchain wallet key states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLogosBlockchainWalletKeyState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLogosBlockchainWalletKeyState> })}
					{@const blockheadLogosBlockchainWalletKeyStateFields = { ...blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector], ...blockheadLogosBlockchainWalletKeyState }}
					<BlockheadLogosBlockchainWalletKeyStateView
						selection={select(EntityType.BlockheadLogosBlockchainWalletKeyState, blockheadLogosBlockchainWalletKeyState[EntityMetaKey.Selector])}
						prefetched={blockheadLogosBlockchainWalletKeyStateFields}
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
		entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
