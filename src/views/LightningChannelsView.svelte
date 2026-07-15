<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LightningChannel>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
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
					shortChannelId: true,
					$node1: true,
					channelId: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(lightningChannels)}
			{@const uniqueLightningChannels = [...new Map(lightningChannels.values.map((lightningChannel) => [lightningChannel[EntityMetaKey.SelectorKey], lightningChannel])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningChannel}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lightningChannels.totalCount}
				getKey={(lightningChannel) => lightningChannel[EntityMetaKey.SelectorKey]}
				items={uniqueLightningChannels}
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
					{@const selection = select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const lightningChannelHrefFields = { ...lightningChannel, ...lightningChannel[EntityMetaKey.Selector] }}
					<LightningChannelView
						selection={selection}
						prefetched={lightningChannelFields}
						href={
							(lightningChannelHrefFields.channelId !== undefined && lightningChannelHrefFields.$network !== undefined && lightningChannelHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
								channelId: String(lightningChannelHrefFields.channelId ?? ''),
								network: String(caip2StringFromValue(lightningChannelHrefFields.$network.caip2) ?? ''),
							}) : lightningChannelHrefFields.channelId !== undefined && lightningChannelHrefFields.$network !== undefined && lightningChannelHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
								channelId: String(lightningChannelHrefFields.channelId ?? ''),
								network: String(lightningChannelHrefFields.$network.slug ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.LightningChannel}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
