<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Lens accounts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensAccounts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LensAccount>
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
	entityType={EntityType.LensAccount}
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
				$icon: true,
				displayName: true,
				localName: true,
				address: true,
				legacyProfileId: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lensAccounts) => [...new Map(lensAccounts.values.map((lensAccount) => [lensAccount[EntityMetaKey.SelectorKey], lensAccount])).values()]}
	getKey={(lensAccount) => lensAccount[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensAccount })}
		{@const lensAccountFields = { ...lensAccount[EntityMetaKey.Selector], ...lensAccount }}
		<EntityView
			entityType={EntityType.LensAccount}
			entitySelector={lensAccount[EntityMetaKey.Selector]}
			href={
				(
					lensAccount[EntityMetaKey.Selector] != null && 'address' in lensAccount[EntityMetaKey.Selector]
					&& lensAccount[EntityMetaKey.Selector].address != null ?
						resolve('/lens/account/[address=evmAddress]', {
					address: String(lensAccount[EntityMetaKey.Selector].address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((lensAccountFields.displayName) ?? ''), String((lensAccountFields.localName) ?? ''), String((lensAccountFields.address) ?? ''), String((lensAccountFields.legacyProfileId) ?? '')].filter(Boolean).join(' ') || 'Lens account'}
			{/snippet}

			{#snippet Value()}
				{[String((lensAccountFields.localName) ?? ''), String((lensAccountFields.address) ?? ''), String((lensAccountFields.legacyProfileId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((lensAccountFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
