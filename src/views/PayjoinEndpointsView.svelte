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
		title = 'Payjoin endpoints',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PayjoinEndpoints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PayjoinEndpoint>
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
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
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
					endpointUrl: true,
					protocolVersion: true,
					$directory: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(payjoinEndpoints)}
			{@const uniquePayjoinEndpoints = [...new Map(payjoinEndpoints.values.map((payjoinEndpoint) => [payjoinEndpoint[EntityMetaKey.SelectorKey], payjoinEndpoint])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PayjoinEndpoint}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={payjoinEndpoints.totalCount}
				getKey={(payjoinEndpoint) => payjoinEndpoint[EntityMetaKey.SelectorKey]}
				items={uniquePayjoinEndpoints}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Payjoin endpoints yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: payjoinEndpoint }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PayjoinEndpoint> })}
					{@const payjoinEndpointFields = { ...payjoinEndpoint[EntityMetaKey.Selector], ...payjoinEndpoint }}
					<PayjoinEndpointView
						selection={select(EntityType.PayjoinEndpoint, payjoinEndpoint[EntityMetaKey.Selector])}
						prefetched={payjoinEndpointFields}
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
		entityType={EntityType.PayjoinEndpoint}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
