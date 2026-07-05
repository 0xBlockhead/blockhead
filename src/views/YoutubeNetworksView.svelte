<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'YouTube Data API',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeNetwork>
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
	import YoutubeNetworkView from '$/views/YoutubeNetworkView.svelte'
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
					protocolName: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(youtubeNetworks)}
			{@const uniqueYoutubeNetworks = [...new Map(youtubeNetworks.values.map((youtubeNetwork) => [youtubeNetwork[EntityMetaKey.SelectorKey], youtubeNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeNetworks.totalCount}
				getKey={(youtubeNetwork) => youtubeNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube Data API yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeNetwork> })}
					{@const youtubeNetworkFields = { ...youtubeNetwork[EntityMetaKey.Selector], ...youtubeNetwork }}
					{@const youtubeNetworkHrefFields = { ...youtubeNetwork, ...youtubeNetwork[EntityMetaKey.Selector] }}
					<YoutubeNetworkView
						selection={select(EntityType.YoutubeNetwork, youtubeNetwork[EntityMetaKey.Selector])}
						prefetched={youtubeNetworkFields}
						href={resolve('/(social)/(youtube)/youtube/api')}
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
		entityType={EntityType.YoutubeNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
