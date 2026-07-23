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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ContractInterfaceMember>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.ContractInterfaceMember}
			entitySelector={contractInterfaceMember[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((contractInterfaceMemberFields.name) ?? ''), String((contractInterfaceMemberFields.canonicalSignature) ?? ''), String((contractInterfaceMemberFields.memberKey) ?? '')].filter(Boolean).join(' ') || 'contract interface member'}
			{/snippet}

			{#snippet Value()}
				{[String((contractInterfaceMemberFields.memberKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((contractInterfaceMemberFields.interfaceId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
