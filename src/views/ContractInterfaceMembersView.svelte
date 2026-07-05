<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Contract interface members',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ContractInterfaceMembers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ContractInterfaceMember>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ContractInterfaceMemberView from '$/views/ContractInterfaceMemberView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					name: true,
					canonicalSignature: true,
					memberKey: true,
					memberKind: true,
					interfaceId: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(contractInterfaceMembers)}
			{@const uniqueContractInterfaceMembers = [...new Map(contractInterfaceMembers.values.map((contractInterfaceMember) => [contractInterfaceMember[EntityMetaKey.SelectorKey], contractInterfaceMember])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ContractInterfaceMember}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={contractInterfaceMembers.totalCount}
				getKey={(contractInterfaceMember) => contractInterfaceMember[EntityMetaKey.SelectorKey]}
				items={uniqueContractInterfaceMembers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Contract interface members yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: contractInterfaceMember }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ContractInterfaceMember> })}
					{@const contractInterfaceMemberFields = { ...contractInterfaceMember[EntityMetaKey.Selector], ...contractInterfaceMember }}
					<ContractInterfaceMemberView
						selection={select(EntityType.ContractInterfaceMember, contractInterfaceMember[EntityMetaKey.Selector])}
						prefetched={contractInterfaceMemberFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.ContractInterfaceMember}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
