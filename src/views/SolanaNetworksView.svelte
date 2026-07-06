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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Solana networks',
		typeAnnotationParagraphs = ['A Solana cluster identified by its CAIP-2 namespace and reference.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaNetwork>
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
	import SolanaNetworkView from '$/views/SolanaNetworkView.svelte'
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
					caip2: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaNetworks)}
			{@const uniqueSolanaNetworks = [...new Map(solanaNetworks.values.map((solanaNetwork) => [solanaNetwork[EntityMetaKey.SelectorKey], solanaNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaNetworks.totalCount}
				getKey={(solanaNetwork) => solanaNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaNetwork> })}
					{@const solanaNetworkFields = { ...solanaNetwork[EntityMetaKey.Selector], ...solanaNetwork }}
					{@const solanaNetworkHrefFields = { ...solanaNetwork, ...solanaNetwork[EntityMetaKey.Selector] }}
					<SolanaNetworkView
						selection={select(EntityType.SolanaNetwork, solanaNetwork[EntityMetaKey.Selector])}
						prefetched={solanaNetworkFields}
						href={
							(solanaNetworkHrefFields.caip2 !== undefined && solanaNetworkHrefFields.caip2.namespace !== undefined && solanaNetworkHrefFields.caip2 !== undefined && solanaNetworkHrefFields.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana', {
								networkSlug: String(networkByCaip2[String(String(solanaNetworkHrefFields.caip2.namespace) + ':' + String(solanaNetworkHrefFields.caip2.reference))].slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.SolanaNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
