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
		title = 'Global IPFS accesses',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalIpfsAccesses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalIpfsAccess>
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
	entityType={EntityType._GlobalIpfsAccess}
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
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalIpfsAccesses) => [...new Map(globalIpfsAccesses.values.map((globalIpfsAccess) => [globalIpfsAccess[EntityMetaKey.SelectorKey], globalIpfsAccess])).values()]}
	getKey={(globalIpfsAccess) => globalIpfsAccess[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global IPFS accesses yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalIpfsAccess })}
		{@const globalIpfsAccessFields = { ...globalIpfsAccess[EntityMetaKey.Selector], ...globalIpfsAccess }}
		<EntityView
			entityType={EntityType._GlobalIpfsAccess}
			entitySelector={globalIpfsAccess[EntityMetaKey.Selector]}
			href={
				(
					globalIpfsAccess[EntityMetaKey.Selector].scope === '_GlobalIpfsAccess' ?
						resolve('/ipfs/access')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'global IPFS access'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
