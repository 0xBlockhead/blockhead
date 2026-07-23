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
		title = 'X users',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XUsers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XUser>
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
	entityType={EntityType.XUser}
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
				name: true,
				username: true,
				id: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xUsers) => [...new Map(xUsers.values.map((xUser) => [xUser[EntityMetaKey.SelectorKey], xUser])).values()]}
	getKey={(xUser) => xUser[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No X users yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xUser })}
		{@const xUserFields = { ...xUser[EntityMetaKey.Selector], ...xUser }}
		<EntityView
			entityType={EntityType.XUser}
			entitySelector={xUser[EntityMetaKey.Selector]}
			href={
				(
					xUser[EntityMetaKey.Selector] != null && 'id' in xUser[EntityMetaKey.Selector]
					&& xUser[EntityMetaKey.Selector].id != null ?
						resolve('/x/user/[userId=stringSegment]', {
					userId: String(xUser[EntityMetaKey.Selector].id ?? ''),
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
				{[String((xUserFields.name) ?? ''), String((xUserFields.username) ?? ''), String((xUserFields.id) ?? '')].filter(Boolean).join(' ') || 'X user'}
			{/snippet}

			{#snippet Value()}
				{[(String((xUserFields.username) ?? '') ? '@' + String((xUserFields.username) ?? '') : ''), String((xUserFields.id) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((xUserFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
