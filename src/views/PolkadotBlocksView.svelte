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
		id = 'PolkadotBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotBlock>
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
	entityType={EntityType.PolkadotBlock}
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
	getResourceItems={(polkadotBlocks) => [...new Map(polkadotBlocks.values.map((polkadotBlock) => [polkadotBlock[EntityMetaKey.SelectorKey], polkadotBlock])).values()]}
	getKey={(polkadotBlock) => polkadotBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotBlock })}
		{@const polkadotBlockFields = { ...polkadotBlock[EntityMetaKey.Selector], ...polkadotBlock }}
		<EntityView
			entityType={EntityType.PolkadotBlock}
			entitySelector={polkadotBlock[EntityMetaKey.Selector]}
			href={
				(
					polkadotBlock[EntityMetaKey.Selector] != null && 'blockNumber' in polkadotBlock[EntityMetaKey.Selector]
					&& polkadotBlock[EntityMetaKey.Selector].blockNumber != null ?
						polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
						&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotBlock[EntityMetaKey.Selector].$network
						&& polkadotBlock[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
						blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
						network: String(caip2StringFromValue(polkadotBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
							&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'slug' in polkadotBlock[EntityMetaKey.Selector].$network
							&& polkadotBlock[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
							network: String(polkadotBlock[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
								polkadotBlock[EntityMetaKey.Selector] != null && 'hash' in polkadotBlock[EntityMetaKey.Selector]
								&& polkadotBlock[EntityMetaKey.Selector].hash != null
								&& polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
								&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotBlock[EntityMetaKey.Selector].$network
								&& polkadotBlock[EntityMetaKey.Selector].$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
								hash: String(polkadotBlock[EntityMetaKey.Selector].hash ?? ''),
								network: String(caip2StringFromValue(polkadotBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
							})
							:
									polkadotBlock[EntityMetaKey.Selector] != null && 'hash' in polkadotBlock[EntityMetaKey.Selector]
									&& polkadotBlock[EntityMetaKey.Selector].hash != null
									&& polkadotBlock[EntityMetaKey.Selector] != null && '$network' in polkadotBlock[EntityMetaKey.Selector]
									&& polkadotBlock[EntityMetaKey.Selector].$network != null && 'slug' in polkadotBlock[EntityMetaKey.Selector].$network
									&& polkadotBlock[EntityMetaKey.Selector].$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
									blockNumber: String(polkadotBlock[EntityMetaKey.Selector].blockNumber ?? ''),
									hash: String(polkadotBlock[EntityMetaKey.Selector].hash ?? ''),
									network: String(polkadotBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((polkadotBlockFields.blockNumber) ?? '') ? 'Block #' + String((polkadotBlockFields.blockNumber) ?? '') : '') || [String((polkadotBlockFields.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((polkadotBlockFields.hash) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
