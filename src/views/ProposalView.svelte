<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'


	// State
	import { entityCollections } from '$/data/collections/entityCollections.ts'
	import { sourcesForEntityBaseLiveQuery } from '$/data/tanstackDb/entityQuerySources.ts'
	import { entityCollectionRowIdEqualsEntityIdByFields } from '$/data/tanstackDb/entityCollectionRowWhere.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { and, inArray, useLiveQuery } from '@tanstack/svelte-db'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
	}: {
		children?: Snippet
		entityId: EntityId<EntityType.Proposal>
		href: string
		open?: boolean
	} = $props()


	// (Derived)
	const proposalRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					p: entityCollections[EntityType.Proposal],
				})
				.where(({ p }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							p.$id,
							entityId,
							[
								'realm',
								'kind',
								'number',
							],
						),
						inArray(
							p[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.Proposal),
						),
					),
				)
				.findOne()
				.select(({ p }) => p)
		),
		[() => entityId],
	)

	const row = $derived(proposalRowQuery.data)
	const realm = $derived(entityId.realm)
	const category = $derived(row?.category)
	const body = $derived(row?.body)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	{href}
	{open}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.Proposal}
				{entityId}
			>
				<Boundary>
					{#snippet Failed(err, _retry)}
						<p role="alert">
							{String(err)}
						</p>
					{/snippet}

					{#if proposalRowQuery.isLoading}
						<p data-text="muted">
							Loading…
						</p>
					{:else if proposalRowQuery.isError}
						<p role="alert">
							Could not load proposal.
						</p>
					{:else}
						<dl data-column>
							<dt data-text="annotation">
								Realm
							</dt>
							<dd>
								{String(realm)}
							</dd>
							<dt data-text="annotation">
								Category
							</dt>
							<dd>
								{category != null && category !== '' ? category : '–'}
							</dd>
							<dt data-text="annotation">
								Body
							</dt>
							<dd>
								{#if body != null && typeof body === 'string' && body.length > 0}
									<pre data-scroll-container>{body}</pre>
								{:else}
									<span data-text="muted">–</span>
								{/if}
							</dd>
						</dl>
					{/if}
				</Boundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
