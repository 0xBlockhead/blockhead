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
		title = 'Bnb beacon tokens',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconTokens-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BnbBeaconToken>
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
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconToken}
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
				symbol: true,
				tokenName: true,
				tokenType: true,
			},
		})
	}
	getResourceItems={(bnbBeaconTokens) => [...new Map(bnbBeaconTokens.values.map((bnbBeaconToken) => [bnbBeaconToken[EntityMetaKey.SelectorKey], bnbBeaconToken])).values()]}
	getKey={(bnbBeaconToken) => bnbBeaconToken[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon tokens yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconToken })}
		{@const bnbBeaconTokenFields = { ...bnbBeaconToken[EntityMetaKey.Selector], ...bnbBeaconToken }}
		{@const selection = select(EntityType.BnbBeaconToken, bnbBeaconToken[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BnbBeaconTokenView
			selection={selection}
			prefetched={bnbBeaconTokenFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
