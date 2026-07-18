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
		title = 'EIP-7702 authorizations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip7702Authorizations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Eip7702Authorization>
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
	import Eip7702AuthorizationView from '$/views/Eip7702AuthorizationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip7702Authorization}
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
				authorizationIndex: true,
				delegationAddress: true,
				authority: true,
			},
		})
	}
	getResourceItems={(eip7702Authorizations) => [...new Map(eip7702Authorizations.values.map((eip7702Authorization) => [eip7702Authorization[EntityMetaKey.SelectorKey], eip7702Authorization])).values()]}
	getKey={(eip7702Authorization) => eip7702Authorization[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eip7702 authorizations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip7702Authorization })}
		{@const eip7702AuthorizationFields = { ...eip7702Authorization[EntityMetaKey.Selector], ...eip7702Authorization }}
		{@const selection = select(EntityType.Eip7702Authorization, eip7702Authorization[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<Eip7702AuthorizationView
			selection={selection}
			prefetched={eip7702AuthorizationFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
