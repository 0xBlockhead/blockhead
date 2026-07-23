<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Network stacks',
		typeAnnotationParagraphs = ['A curated protocol-stack classification used by network catalog rows.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NetworkStacks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NetworkStack>
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
	entityType={EntityType.NetworkStack}
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
				label: true,
				networkStackId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(networkStacks) => [...new Map(networkStacks.values.map((networkStack) => [networkStack[EntityMetaKey.SelectorKey], networkStack])).values()]}
	getKey={(networkStack) => networkStack[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network stacks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkStack })}
		{@const networkStackFields = { ...networkStack[EntityMetaKey.Selector], ...networkStack }}
		<EntityView
			entityType={EntityType.NetworkStack}
			entitySelector={networkStack[EntityMetaKey.Selector]}
			href={
				(
					networkStack[EntityMetaKey.Selector] != null && 'networkStackId' in networkStack[EntityMetaKey.Selector]
					&& networkStack[EntityMetaKey.Selector].networkStackId != null ?
						resolve('/network-stack/[networkStackId=stringSegment]', {
					networkStackId: String(networkStack[EntityMetaKey.Selector].networkStackId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkStackFields.label) ?? '')].filter(Boolean).join(' ') || [String((networkStackFields.networkStackId) ?? '')].filter(Boolean).join(' ') || 'network stack'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
