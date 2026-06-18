<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { blockheadFarcasterConnectionAuthMethodByAuthMethod } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
			{ accountId: String(selector.fid) },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const connection = $derived(select(EntityType.BlockheadFarcasterAccountConnection, selector, ({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			], fields: { username: true, displayName: true, $icon: true, bio: true, ...(open ? ({ verifications: true, custody: true, authMethod: true, signedAt: true }) : ({  })) } })))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if connection.fields.$icon?.[EntityMetaKey.Selector].url}
					<IconComponent
						shape={IconShape.Circle}
						src={connection.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(selector.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{connection.fields.displayName ?? connection.fields.username ?? String(selector.fid)}
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
					connection.fields.username !== undefined
					&& connection.fields.username !== (
						connection.fields.displayName ?? connection.fields.username ?? String(selector.fid)
					)
				)}
					<span data-text="muted">
						@{connection.fields.username}
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
				{#if connection.fields.bio}
					<p>
						<TruncatedValue
							value={connection.fields.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if (
						open
						&& connection.fields.username
					)}
						<div>
							<dt>Username</dt>
							<dd>@{connection.fields.username}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.fields.authMethod
						)}
						<div>
							<dt>Auth method</dt>
							<dd>
								{blockheadFarcasterConnectionAuthMethodByAuthMethod[connection.fields.authMethod].label}
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.fields.custody
						)}
						<div>
							<dt>Custody</dt>
							<dd>{connection.fields.custody}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.fields.verifications
						&& connection.fields.verifications.length
						)}
						<div>
							<dt>Verifications</dt>
							<dd>{connection.fields.verifications.join(', ')}</dd>
						</div>
					{/if}

					{#if (
						open
						&& connection.fields.signedAt !== undefined
					)}
						<div>
							<dt>Signed at</dt>
							<dd><Timestamp timestamp={connection.fields.signedAt} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
