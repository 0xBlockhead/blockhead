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
		title = 'MEV relay proposer payloads delivered',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_ProposerPayloadDelivereds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MevRelay_ProposerPayloadDelivered>
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
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
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
				value: true,
				$builder: true,
				relayHost: true,
				blockHash: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mevRelayProposerPayloadDelivereds) => [...new Map(mevRelayProposerPayloadDelivereds.values.map((mevRelayProposerPayloadDelivered) => [mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey], mevRelayProposerPayloadDelivered])).values()]}
	getKey={(mevRelayProposerPayloadDelivered) => mevRelayProposerPayloadDelivered[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MEV relay proposer payloads delivered yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mevRelayProposerPayloadDelivered })}
		{@const mevRelayProposerPayloadDeliveredFields = { ...mevRelayProposerPayloadDelivered[EntityMetaKey.Selector], ...mevRelayProposerPayloadDelivered }}
		<EntityView
			entityType={EntityType.MevRelay_ProposerPayloadDelivered}
			entitySelector={mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]}
			href={
				(
					mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] != null && 'relayHost' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].relayHost != null
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] != null && 'slot' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].slot != null
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] != null && 'blockHash' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector]
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].blockHash != null
					&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] != null && '$network' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector] ?
						mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network != null && 'caip2' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network
						&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', {
						relayHost: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].relayHost ?? ''),
						slot: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].slot ?? ''),
						blockHash: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].blockHash ?? ''),
						network: String(caip2StringFromValue(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network != null && 'slug' in mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network
							&& mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', {
							relayHost: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].relayHost ?? ''),
							slot: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].slot ?? ''),
							blockHash: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].blockHash ?? ''),
							network: String(mevRelayProposerPayloadDelivered[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[(String((mevRelayProposerPayloadDeliveredFields.slot) ?? '') ? 'Slot ' + String((mevRelayProposerPayloadDeliveredFields.slot) ?? '') : ''), (String((mevRelayProposerPayloadDeliveredFields.value) ?? '') ? String((mevRelayProposerPayloadDeliveredFields.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered'}
			{/snippet}

			{#snippet Value()}
				{[(String((mevRelayProposerPayloadDeliveredFields.value) ?? '') ? String((mevRelayProposerPayloadDeliveredFields.value) ?? '') + ' wei' : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((mevRelayProposerPayloadDeliveredFields.$builder.builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
