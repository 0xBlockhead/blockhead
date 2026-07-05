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
		title = 'MEV relays',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelays-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevRelay>
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
	import MevRelayView from '$/views/MevRelayView.svelte'
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
					host: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(mevRelays)}
			{@const uniqueMevRelays = [...new Map(mevRelays.values.map((mevRelay) => [mevRelay[EntityMetaKey.SelectorKey], mevRelay])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevRelays.totalCount}
				getKey={(mevRelay) => mevRelay[EntityMetaKey.SelectorKey]}
				items={uniqueMevRelays}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV relays yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevRelay }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MevRelay> })}
					{@const mevRelayFields = { ...mevRelay[EntityMetaKey.Selector], ...mevRelay }}
					{@const mevRelayHrefFields = { ...mevRelay, ...mevRelay[EntityMetaKey.Selector] }}
					<MevRelayView
						selection={select(EntityType.MevRelay, mevRelay[EntityMetaKey.Selector])}
						prefetched={mevRelayFields}
						href={
							(mevRelayHrefFields.$network !== undefined && mevRelayHrefFields.$network.caip2 !== undefined && mevRelayHrefFields.$network.caip2.namespace !== undefined && mevRelayHrefFields.$network !== undefined && mevRelayHrefFields.$network.caip2 !== undefined && mevRelayHrefFields.$network.caip2.reference !== undefined && mevRelayHrefFields.host !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
								caip2: `${String(mevRelayHrefFields.$network.caip2.namespace ?? '')}:${String(mevRelayHrefFields.$network.caip2.reference ?? '')}`,
								host: String(mevRelayHrefFields.host ?? ''),
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
		entityType={EntityType.MevRelay}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
