<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Payjoin endpoints',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PayjoinEndpoints-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PayjoinEndpoint>
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
	entityType={EntityType.PayjoinEndpoint}
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
				endpointUrl: true,
				protocolVersion: true,
				$directory: true,
			},
		})
	}
	{countResource}
	getResourceItems={(payjoinEndpoints) => [...new Map(payjoinEndpoints.values.map((payjoinEndpoint) => [payjoinEndpoint[EntityMetaKey.SelectorKey], payjoinEndpoint])).values()]}
	getKey={(payjoinEndpoint) => payjoinEndpoint[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Payjoin endpoints yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: payjoinEndpoint })}
		{@const payjoinEndpointFields = { ...payjoinEndpoint[EntityMetaKey.Selector], ...payjoinEndpoint }}
		<EntityView
			entityType={EntityType.PayjoinEndpoint}
			entitySelector={payjoinEndpoint[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((payjoinEndpointFields.endpointUrl) ?? '')].filter(Boolean).join(' ') || 'payjoin endpoint'}
			{/snippet}

			{#snippet Value()}
				{[String((payjoinEndpointFields.protocolVersion) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((payjoinEndpointFields.$directory.directoryUrl) ?? '')].filter(Boolean).join(' ') || 'payjoin directory'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
