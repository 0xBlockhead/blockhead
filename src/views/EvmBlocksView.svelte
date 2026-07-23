<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM blocks',
		typeAnnotationParagraphs = ['A block in an EVM-compatible execution chain.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmBlock>
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
	entityType={EntityType.EvmBlock}
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
				hash: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmBlocks) => [...new Map(evmBlocks.values.map((evmBlock) => [evmBlock[EntityMetaKey.SelectorKey], evmBlock])).values()]}
	getKey={(evmBlock) => evmBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmBlock })}
		{@const evmBlockFields = { ...evmBlock[EntityMetaKey.Selector], ...evmBlock }}
		<EntityView
			entityType={EntityType.EvmBlock}
			entitySelector={evmBlock[EntityMetaKey.Selector]}
			href={
				(
					evmBlock[EntityMetaKey.Selector] != null && 'blockNumber' in evmBlock[EntityMetaKey.Selector]
					&& evmBlock[EntityMetaKey.Selector].blockNumber != null
					&& evmBlock[EntityMetaKey.Selector] != null && '$network' in evmBlock[EntityMetaKey.Selector] ?
						evmBlock[EntityMetaKey.Selector].$network != null && 'caip2' in evmBlock[EntityMetaKey.Selector].$network
						&& evmBlock[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
						blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
						network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmBlock[EntityMetaKey.Selector].$network != null && 'slug' in evmBlock[EntityMetaKey.Selector].$network
							&& evmBlock[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
							network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((evmBlockFields.blockNumber) ?? '') ? 'Block #' + String((evmBlockFields.blockNumber) ?? '') : '') || [String((evmBlockFields.hash) ?? '')].filter(Boolean).join(' ') || 'EVM block'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
