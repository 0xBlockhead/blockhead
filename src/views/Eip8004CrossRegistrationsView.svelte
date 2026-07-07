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
		title = 'EIP-8004 cross registrations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004CrossRegistrations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Eip8004CrossRegistration>
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
	import Eip8004CrossRegistrationView from '$/views/Eip8004CrossRegistrationView.svelte'
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
					targetKind: true,
					targetSelectorHash: true,
					targetSelectorHashAlgorithm: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004CrossRegistration}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(eip8004CrossRegistrations)}
			{@const uniqueEip8004CrossRegistrations = [...new Map(eip8004CrossRegistrations.values.map((eip8004CrossRegistration) => [eip8004CrossRegistration[EntityMetaKey.SelectorKey], eip8004CrossRegistration])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004CrossRegistration}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eip8004CrossRegistrations.totalCount}
				getKey={(eip8004CrossRegistration) => eip8004CrossRegistration[EntityMetaKey.SelectorKey]}
				items={uniqueEip8004CrossRegistrations}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EIP-8004 cross registrations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eip8004CrossRegistration }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Eip8004CrossRegistration> })}
					{@const eip8004CrossRegistrationFields = { ...eip8004CrossRegistration[EntityMetaKey.Selector], ...eip8004CrossRegistration }}
					<Eip8004CrossRegistrationView
						selection={select(EntityType.Eip8004CrossRegistration, eip8004CrossRegistration[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={eip8004CrossRegistrationFields}
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
		entityType={EntityType.Eip8004CrossRegistration}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
