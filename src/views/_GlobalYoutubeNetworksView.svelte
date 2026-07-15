<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'YouTube networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalYoutubeNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalYoutubeNetwork>
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
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
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
					scope: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalYoutubeNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalYoutubeNetworks)}
			{@const uniqueGlobalYoutubeNetworks = [...new Map(globalYoutubeNetworks.values.map((globalYoutubeNetwork) => [globalYoutubeNetwork[EntityMetaKey.SelectorKey], globalYoutubeNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalYoutubeNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalYoutubeNetworks.totalCount}
				getKey={(globalYoutubeNetwork) => globalYoutubeNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalYoutubeNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalYoutubeNetwork })}
					{@const globalYoutubeNetworkFields = { ...globalYoutubeNetwork[EntityMetaKey.Selector], ...globalYoutubeNetwork }}
					{@const selection = select(EntityType._GlobalYoutubeNetwork, globalYoutubeNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const globalYoutubeNetworkHrefFields = { ...globalYoutubeNetwork, ...globalYoutubeNetwork[EntityMetaKey.Selector] }}
					<GlobalYoutubeNetworkView
						selection={selection}
						prefetched={globalYoutubeNetworkFields}
						href={(globalYoutubeNetwork[EntityMetaKey.Selector].scope === '_GlobalYoutubeNetwork' ? resolve('/youtube') : undefined)}
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
		entityType={EntityType._GlobalYoutubeNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
