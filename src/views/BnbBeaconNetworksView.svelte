<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bnb beacon networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconNetwork>
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
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconNetwork}
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
				$network: true,
				decommissionedAtMs: true,
			},
		})
	}
	getResourceItems={(bnbBeaconNetworks) => [...new Map(bnbBeaconNetworks.values.map((bnbBeaconNetwork) => [bnbBeaconNetwork[EntityMetaKey.SelectorKey], bnbBeaconNetwork])).values()]}
	getKey={(bnbBeaconNetwork) => bnbBeaconNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconNetwork })}
		{@const bnbBeaconNetworkFields = { ...bnbBeaconNetwork[EntityMetaKey.Selector], ...bnbBeaconNetwork }}
		{@const selection = select(EntityType.BnbBeaconNetwork, bnbBeaconNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconNetworkView
			selection={selection}
			prefetched={bnbBeaconNetworkFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
