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
		title = 'Contract interface members',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ContractInterfaceMembers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ContractInterfaceMember>
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
	import ContractInterfaceMemberView from '$/views/ContractInterfaceMemberView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ContractInterfaceMember}
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
				name: true,
				canonicalSignature: true,
				memberKey: true,
				memberKind: true,
				interfaceId: true,
			},
		})
	}
	getResourceItems={(contractInterfaceMembers) => [...new Map(contractInterfaceMembers.values.map((contractInterfaceMember) => [contractInterfaceMember[EntityMetaKey.SelectorKey], contractInterfaceMember])).values()]}
	getKey={(contractInterfaceMember) => contractInterfaceMember[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Contract interface members yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: contractInterfaceMember })}
		{@const contractInterfaceMemberFields = { ...contractInterfaceMember[EntityMetaKey.Selector], ...contractInterfaceMember }}
		{@const selection = select(EntityType.ContractInterfaceMember, contractInterfaceMember[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<ContractInterfaceMemberView
			selection={selection}
			prefetched={contractInterfaceMemberFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
