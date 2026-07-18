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
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalIpfsAccess>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
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
		{@const selection = select(EntityType._GlobalIpfsAccess, globalIpfsAccess[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const globalIpfsAccessHrefFields = { ...globalIpfsAccess, ...globalIpfsAccess[EntityMetaKey.Selector] }}
		<GlobalIpfsAccessView
			selection={selection}
			prefetched={globalIpfsAccessFields}
			href={(globalIpfsAccess[EntityMetaKey.Selector].scope === '_GlobalIpfsAccess' ? resolve('/ipfs/access') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
