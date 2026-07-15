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
		title = 'ActivityPub observeds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalActivityPubNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalActivityPubNetwork>
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
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
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
				entityType={EntityType._GlobalActivityPubNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalActivityPubNetworks)}
			{@const uniqueGlobalActivityPubNetworks = [...new Map(globalActivityPubNetworks.values.map((globalActivityPubNetwork) => [globalActivityPubNetwork[EntityMetaKey.SelectorKey], globalActivityPubNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalActivityPubNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalActivityPubNetworks.totalCount}
				getKey={(globalActivityPubNetwork) => globalActivityPubNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalActivityPubNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global ActivityPub networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalActivityPubNetwork })}
					{@const globalActivityPubNetworkFields = { ...globalActivityPubNetwork[EntityMetaKey.Selector], ...globalActivityPubNetwork }}
					{@const selection = select(EntityType._GlobalActivityPubNetwork, globalActivityPubNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const globalActivityPubNetworkHrefFields = { ...globalActivityPubNetwork, ...globalActivityPubNetwork[EntityMetaKey.Selector] }}
					<GlobalActivityPubNetworkView
						selection={selection}
						prefetched={globalActivityPubNetworkFields}
						href={(globalActivityPubNetwork[EntityMetaKey.Selector].scope === '_GlobalActivityPubNetwork' ? resolve('/activitypub') : undefined)}
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
		entityType={EntityType._GlobalActivityPubNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
