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
		title = 'Farcaster users',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterUsers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterUser>
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
	entityType={EntityType.FarcasterUser}
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
				username: true,
				fid: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterUsers) => [...new Map(farcasterUsers.values.map((farcasterUser) => [farcasterUser[EntityMetaKey.SelectorKey], farcasterUser])).values()]}
	getKey={(farcasterUser) => farcasterUser[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster users yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterUser })}
		{@const farcasterUserFields = { ...farcasterUser[EntityMetaKey.Selector], ...farcasterUser }}
		<EntityView
			entityType={EntityType.FarcasterUser}
			entitySelector={farcasterUser[EntityMetaKey.Selector]}
			href={
				(
					farcasterUser[EntityMetaKey.Selector] != null && 'fid' in farcasterUser[EntityMetaKey.Selector]
					&& farcasterUser[EntityMetaKey.Selector].fid != null ?
						resolve('/farcaster/user/[userId=farcasterFid]', {
					userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
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
				{[String((farcasterUserFields.displayName) ?? ''), String((farcasterUserFields.username) ?? ''), String((farcasterUserFields.fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterUserFields.fid) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((farcasterUserFields.username) ?? '') ? '@' + String((farcasterUserFields.username) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
