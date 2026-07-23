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
		title = 'Blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaBlock>
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
	entityType={EntityType.SolanaBlock}
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
				slot: true,
				blockHeight: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(solanaBlocks) => [...new Map(solanaBlocks.values.map((solanaBlock) => [solanaBlock[EntityMetaKey.SelectorKey], solanaBlock])).values()]}
	getKey={(solanaBlock) => solanaBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaBlock })}
		{@const solanaBlockFields = { ...solanaBlock[EntityMetaKey.Selector], ...solanaBlock }}
		<EntityView
			entityType={EntityType.SolanaBlock}
			entitySelector={solanaBlock[EntityMetaKey.Selector]}
			href={
				(
					solanaBlock[EntityMetaKey.Selector] != null && 'slot' in solanaBlock[EntityMetaKey.Selector]
					&& solanaBlock[EntityMetaKey.Selector].slot != null
					&& solanaBlock[EntityMetaKey.Selector] != null && '$network' in solanaBlock[EntityMetaKey.Selector] ?
						solanaBlock[EntityMetaKey.Selector].$network != null && 'caip2' in solanaBlock[EntityMetaKey.Selector].$network
						&& solanaBlock[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
						blockNumber: String(solanaBlock[EntityMetaKey.Selector].slot ?? ''),
						network: String(caip2StringFromValue(solanaBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							solanaBlock[EntityMetaKey.Selector].$network != null && 'slug' in solanaBlock[EntityMetaKey.Selector].$network
							&& solanaBlock[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(solanaBlock[EntityMetaKey.Selector].slot ?? ''),
							network: String(solanaBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((solanaBlockFields.slot) ?? '') ? 'Slot #' + String((solanaBlockFields.slot) ?? '') : '') || 'solana block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((solanaBlockFields.blockHeight) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
