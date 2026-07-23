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




	// State
	let {
		selection,
		countResource,
		title = 'Farcaster channels',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterChannels-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterChannel>
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
	entityType={EntityType.FarcasterChannel}
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
				$icon: true,
				name: true,
				id: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterChannels) => [...new Map(farcasterChannels.values.map((farcasterChannel) => [farcasterChannel[EntityMetaKey.SelectorKey], farcasterChannel])).values()]}
	getKey={(farcasterChannel) => farcasterChannel[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster channels yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterChannel })}
		{@const farcasterChannelFields = { ...farcasterChannel[EntityMetaKey.Selector], ...farcasterChannel }}
		<EntityView
			entityType={EntityType.FarcasterChannel}
			entitySelector={farcasterChannel[EntityMetaKey.Selector]}
			href={
				(
					farcasterChannel[EntityMetaKey.Selector] != null && 'id' in farcasterChannel[EntityMetaKey.Selector]
					&& farcasterChannel[EntityMetaKey.Selector].id != null ?
						resolve('/farcaster/channel/[channelId=stringSegment]', {
					channelId: String(farcasterChannel[EntityMetaKey.Selector].id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((farcasterChannelFields.name) ?? ''), String((farcasterChannelFields.id) ?? '')].filter(Boolean).join(' ') || 'Farcaster channel'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterChannelFields.id) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((farcasterChannelFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
