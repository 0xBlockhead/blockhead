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
		title = 'Lightning networks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LightningNetwork>
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
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
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
					name: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(lightningNetworks)}
			{@const uniqueLightningNetworks = [...new Map(lightningNetworks.values.map((lightningNetwork) => [lightningNetwork[EntityMetaKey.SelectorKey], lightningNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LightningNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lightningNetworks.totalCount}
				getKey={(lightningNetwork) => lightningNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueLightningNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lightningNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LightningNetwork> })}
					{@const lightningNetworkFields = { ...lightningNetwork[EntityMetaKey.Selector], ...lightningNetwork }}
					{@const lightningNetworkHrefFields = { ...lightningNetwork, ...lightningNetwork[EntityMetaKey.Selector] }}
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, lightningNetwork[EntityMetaKey.Selector])}
						prefetched={lightningNetworkFields}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(lightningNetworkHrefFields.$network.slug ?? ''),
							})
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
		entityType={EntityType.LightningNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
