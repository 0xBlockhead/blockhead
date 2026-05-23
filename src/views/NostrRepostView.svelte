<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrRepost>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const repost = useEntity(
		EntityType.NostrRepost,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			createdAt: {},
			$author: {},
			$repostedNote: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRepost}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.eventId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={repost}
			placeholderText="Loading repost…"
		>
			{#snippet children(_repost)}
				<TruncatedValue
					value={entityId.eventId}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-6 repost events reference an existing kind-1 note via an <code>e</code>-tag on the signed payload.
		</p>
		<p>
			The repost event id is a 64-character lowercase hex hash of the kind-6 event—not the original note’s event id.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if repost.createdAt != null}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								<Timestamp
									timestamp={repost.createdAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if repost.$author}
					<div>
						<dt>Author</dt>
						<dd>
							<ResourceBoundary
								resource={repost}
								placeholderText="Loading repost…"
							>
								{#snippet children(repost)}
									<NostrProfileView
										entityId={repost.$author[EntityMetaKey.Id]}
										href={resolve('/nostr/profile/[pubkey]', {
											pubkey: repost.$author[EntityMetaKey.Id].pubkey,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if repost.$repostedNote}
					<div>
						<dt>Reposted note</dt>
						<dd>
							<ResourceBoundary
								resource={repost}
								placeholderText="Loading repost…"
							>
								{#snippet children(repost)}
									<NostrNoteView
										entityId={repost.$repostedNote[EntityMetaKey.Id]}
										href={resolve('/nostr/note/[eventId]', {
											eventId: repost.$repostedNote[EntityMetaKey.Id].eventId,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NostrRepost}
			{entityId}
		/>
	{/snippet}
</EntityView>
