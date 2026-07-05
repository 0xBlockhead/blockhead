<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Farcaster',
		typeAnnotationParagraphs = ['Farcaster profiles, channels, and casts: FID plus cast-hash identity with hub feeds from configured Farcaster sources.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterNetwork>
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
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
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
		{#snippet children(farcasterNetworks)}
			{@const uniqueFarcasterNetworks = [...new Map(farcasterNetworks.values.map((farcasterNetwork) => [farcasterNetwork[EntityMetaKey.SelectorKey], farcasterNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterNetworks.totalCount}
				getKey={(farcasterNetwork) => farcasterNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterNetwork> })}
					{@const farcasterNetworkFields = { ...farcasterNetwork[EntityMetaKey.Selector], ...farcasterNetwork }}
					<FarcasterNetworkView
						selection={select(EntityType.FarcasterNetwork, farcasterNetwork[EntityMetaKey.Selector])}
						prefetched={farcasterNetworkFields}
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
		entityType={EntityType.FarcasterNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
