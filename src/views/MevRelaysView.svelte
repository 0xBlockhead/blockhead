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
		title = 'MEV relays',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelays-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MevRelay>
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
	entityType={EntityType.MevRelay}
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
				host: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mevRelays) => [...new Map(mevRelays.values.map((mevRelay) => [mevRelay[EntityMetaKey.SelectorKey], mevRelay])).values()]}
	getKey={(mevRelay) => mevRelay[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MEV relays yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mevRelay })}
		{@const mevRelayFields = { ...mevRelay[EntityMetaKey.Selector], ...mevRelay }}
		<EntityView
			entityType={EntityType.MevRelay}
			entitySelector={mevRelay[EntityMetaKey.Selector]}
			href={
				(
					mevRelay[EntityMetaKey.Selector] != null && 'host' in mevRelay[EntityMetaKey.Selector]
					&& mevRelay[EntityMetaKey.Selector].host != null
					&& mevRelay[EntityMetaKey.Selector] != null && '$network' in mevRelay[EntityMetaKey.Selector] ?
						mevRelay[EntityMetaKey.Selector].$network != null && 'caip2' in mevRelay[EntityMetaKey.Selector].$network
						&& mevRelay[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
						host: String(mevRelay[EntityMetaKey.Selector].host ?? ''),
						network: String(caip2StringFromValue(mevRelay[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							mevRelay[EntityMetaKey.Selector].$network != null && 'slug' in mevRelay[EntityMetaKey.Selector].$network
							&& mevRelay[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
							host: String(mevRelay[EntityMetaKey.Selector].host ?? ''),
							network: String(mevRelay[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((mevRelayFields.host) ?? '')].filter(Boolean).join(' ') || 'MEV relay'}
			{/snippet}

			{#snippet Value()}
				{[String((mevRelayFields.host) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((mevRelayFields.$network.name) ?? '')].filter(Boolean).join(' ') || [mevRelayFields.$network.caip2 == null ? '' : String(`${(mevRelayFields.$network.caip2).namespace}:${(mevRelayFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
