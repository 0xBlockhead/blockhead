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
		title = 'Quilibrium accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'QuilibriumAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.QuilibriumAccount>
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
	entityType={EntityType.QuilibriumAccount}
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
				accountAddress: true,
				$network: true,
				accountKind: true,
			},
		})
	}
	{countResource}
	getResourceItems={(quilibriumAccounts) => [...new Map(quilibriumAccounts.values.map((quilibriumAccount) => [quilibriumAccount[EntityMetaKey.SelectorKey], quilibriumAccount])).values()]}
	getKey={(quilibriumAccount) => quilibriumAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Quilibrium accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: quilibriumAccount })}
		{@const quilibriumAccountFields = { ...quilibriumAccount[EntityMetaKey.Selector], ...quilibriumAccount }}
		<EntityView
			entityType={EntityType.QuilibriumAccount}
			entitySelector={quilibriumAccount[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((quilibriumAccountFields.accountAddress) ?? '')].filter(Boolean).join(' ') || 'quilibrium account'}
			{/snippet}

			{#snippet Value()}
				{[[String((quilibriumAccountFields.$network.name) ?? '')].filter(Boolean).join(' ') || [quilibriumAccountFields.$network.caip2 == null ? '' : String(`${(quilibriumAccountFields.$network.caip2).namespace}:${(quilibriumAccountFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((quilibriumAccountFields.accountKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
