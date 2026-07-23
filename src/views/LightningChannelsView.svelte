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
		title = 'Lightning channels',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LightningChannel>
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
	entityType={EntityType.LightningChannel}
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
				shortChannelId: true,
				$node1: true,
				channelId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lightningChannels) => [...new Map(lightningChannels.values.map((lightningChannel) => [lightningChannel[EntityMetaKey.SelectorKey], lightningChannel])).values()]}
	getKey={(lightningChannel) => lightningChannel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning channels yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lightningChannel })}
		{@const lightningChannelFields = { ...lightningChannel[EntityMetaKey.Selector], ...lightningChannel }}
		<EntityView
			entityType={EntityType.LightningChannel}
			entitySelector={lightningChannel[EntityMetaKey.Selector]}
			href={
				(
					lightningChannel[EntityMetaKey.Selector] != null && 'channelId' in lightningChannel[EntityMetaKey.Selector]
					&& lightningChannel[EntityMetaKey.Selector].channelId != null
					&& lightningChannel[EntityMetaKey.Selector] != null && '$network' in lightningChannel[EntityMetaKey.Selector] ?
						lightningChannel[EntityMetaKey.Selector].$network != null && 'caip2' in lightningChannel[EntityMetaKey.Selector].$network
						&& lightningChannel[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
						channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
						network: String(caip2StringFromValue(lightningChannel[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							lightningChannel[EntityMetaKey.Selector].$network != null && 'slug' in lightningChannel[EntityMetaKey.Selector].$network
							&& lightningChannel[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
							channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
							network: String(lightningChannel[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((lightningChannelFields.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((lightningChannelFields.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'}
			{/snippet}

			{#snippet Value()}
				{[[String((lightningChannelFields.$node1.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
