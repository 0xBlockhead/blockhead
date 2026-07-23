<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Allowance blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmActorCoinAllowance_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmActorCoinAllowance_Block>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmActorCoinAllowance_Block}
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
				blockNumber: true,
				allowance: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmActorCoinAllowanceBlocks) => [...new Map(evmActorCoinAllowanceBlocks.values.map((evmActorCoinAllowanceBlock) => [evmActorCoinAllowanceBlock[EntityMetaKey.SelectorKey], evmActorCoinAllowanceBlock])).values()]}
	getKey={(evmActorCoinAllowanceBlock) => evmActorCoinAllowanceBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM actor coin allowance blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmActorCoinAllowanceBlock })}
		{@const evmActorCoinAllowanceBlockFields = { ...evmActorCoinAllowanceBlock[EntityMetaKey.Selector], ...evmActorCoinAllowanceBlock }}
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance_Block}
			entitySelector={evmActorCoinAllowanceBlock[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((evmActorCoinAllowanceBlockFields.blockNumber) ?? '') ? 'Block ' + String((evmActorCoinAllowanceBlockFields.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || 'EVM actor coin allowance block'}
			{/snippet}

			{#snippet Value()}
				{[String((evmActorCoinAllowanceBlockFields.allowance) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmActorCoinAllowanceBlockFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
