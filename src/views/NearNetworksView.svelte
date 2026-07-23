<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Near networks',
		typeAnnotationParagraphs = ['NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from declared NEAR sources.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NearNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NearNetwork>
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
	entityType={EntityType.NearNetwork}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
			],
			fields: {
				name: true,
				slug: true,
				environment: true,
				namespace: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nearNetworks) => [...new Map(nearNetworks.values.map((nearNetwork) => [nearNetwork[EntityMetaKey.SelectorKey], nearNetwork])).values()]}
	getKey={(nearNetwork) => nearNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Near networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nearNetwork })}
		{@const nearNetworkFields = { ...nearNetwork[EntityMetaKey.Selector], ...nearNetwork }}
		<EntityView
			entityType={EntityType.NearNetwork}
			entitySelector={nearNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((nearNetworkFields.name) ?? ''), String((nearNetworkFields.slug) ?? '')].filter(Boolean).join(' ') || 'near network'}
			{/snippet}

			{#snippet Value()}
				{[String((nearNetworkFields.environment) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nearNetworkFields.namespace) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
