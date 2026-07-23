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
		title = 'EIP-8004 cross registrations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004CrossRegistrations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004CrossRegistration>
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
	entityType={EntityType.Eip8004CrossRegistration}
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
				targetKind: true,
				targetSelectorHash: true,
				targetSelectorHashAlgorithm: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004CrossRegistrations) => [...new Map(eip8004CrossRegistrations.values.map((eip8004CrossRegistration) => [eip8004CrossRegistration[EntityMetaKey.SelectorKey], eip8004CrossRegistration])).values()]}
	getKey={(eip8004CrossRegistration) => eip8004CrossRegistration[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 cross registrations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004CrossRegistration })}
		{@const eip8004CrossRegistrationFields = { ...eip8004CrossRegistration[EntityMetaKey.Selector], ...eip8004CrossRegistration }}
		<EntityView
			entityType={EntityType.Eip8004CrossRegistration}
			entitySelector={eip8004CrossRegistration[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004CrossRegistrationFields.targetKind) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 cross registration'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004CrossRegistrationFields.targetSelectorHash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004CrossRegistrationFields.targetSelectorHashAlgorithm) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
