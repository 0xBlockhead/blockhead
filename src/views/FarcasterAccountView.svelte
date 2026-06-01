<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { blockheadFarcasterConnectionAuthMethodByAuthMethod } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
			{ accountId: String(entityId.fid) },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const connection = useEntity(
		EntityType.BlockheadFarcasterAccountConnection,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
			username: {},
			displayName: {},
			$icon: {},
			bio: {},
			...(open ?
				{
					verifications: {},
					custody: {},
					authMethod: {},
					signedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if connection.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={connection.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{connection.displayName ?? connection.username ?? String(entityId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if (
					connection.username !== undefined
					&& connection.username !== (
						connection.displayName ?? connection.username ?? String(entityId.fid)
					)
				)}
					<span data-text="muted">
						@{connection.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Blockhead-linked Farcaster account: custody or auth-address connection stored for this browser session.
		</p>
		<p>
			Verification blockheadFarcasterAccountConnections are wallet proofs—not the same as a public hub profile cache alone.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if connection.bio}
					<p>
						<TruncatedValue
							value={connection.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if (
						open
						&& connection.username
					)}
						<div>
							<dt>Username</dt>
							<dd>@{connection.username}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.authMethod
						)}
						<div>
							<dt>Auth method</dt>
							<dd>
								{blockheadFarcasterConnectionAuthMethodByAuthMethod[connection.authMethod].label}
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.custody
						)}
						<div>
							<dt>Custody</dt>
							<dd>{connection.custody}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.verifications
						&& connection.verifications.length
						)}
						<div>
							<dt>Verifications</dt>
							<dd>{connection.verifications.join(', ')}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.signedAt !== undefined
					)}
						<div>
							<dt>Signed at</dt>
							<dd><Timestamp timestamp={connection.signedAt} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
	{/snippet}
</EntityView>
