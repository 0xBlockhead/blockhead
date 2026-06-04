<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId: farcasterUserId,
		href = resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
			userId: String(farcasterUserId.fid),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
			href?: string
			open?: boolean
		},
		never
	> = $props()

	const farcasterUser = useEntity(
		EntityType.FarcasterUser,
		farcasterUserId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
			username: {},
			displayName: {},
			$icon: {},
			bio: {},
			url: {},
			primaryEvmAddress: {},
			$$verifiedAddresses: {},
		},
	)


	// (Derived)
	const farcasterUserRow = $derived(
		farcasterUser.ready ? farcasterUser.current : undefined,
	)


	// Components
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entityId={farcasterUserId}
	href={href}
	bind:open
	title="Profile"
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(farcasterUserId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{farcasterUser.displayName
					?? farcasterUser.username
					?? String(farcasterUserId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.username !== undefined
					&& farcasterUser.username !== (
						farcasterUser.displayName
						?? farcasterUser.username
						?? String(farcasterUserId.fid)
					)
				)}
					<span data-text="muted">
						@{farcasterUser.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.bio != null && farcasterUser.bio !== ''}
					<p>
						<TruncatedValue
							value={farcasterUser.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">

			{#if farcasterUserRow?.url != null}
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								<a
									href={farcasterUser.url}
									data-text="muted"
								>{farcasterUser.url}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Verified addresses</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading profile…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.$$verifiedAddresses.length}
									<ul data-column="gap-2">
										{#each farcasterUser.$$verifiedAddresses as verification (String(verification[EntityMetaKey.Id].protocol) + ':' + verification[EntityMetaKey.Id].address)}
											<li>
												{#if verification.$evmAccount}
													<EvmAccountView
														entityId={verification.$evmAccount[EntityMetaKey.Id]}
														href={resolve('/account/[address]', {
															address: verification.$evmAccount[EntityMetaKey.Id].address,
														})}
														layout={EntityLayout.Title}
														open={false}
													/>
												{:else if verification.$solanaAccount}
													<SolanaAccountView
														entityId={verification.$solanaAccount[EntityMetaKey.Id]}
														layout={EntityLayout.Title}
														open={false}
													/>
												{:else}
													<span data-text="mono muted">
														{verification[EntityMetaKey.Id].protocol}:{verification[EntityMetaKey.Id].address}
													</span>
												{/if}
											</li>
									{/each}
								</ul>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& farcasterUserRow?.displayName != null
			)}
				<div>
					<dt>Display name</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.displayName}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& farcasterUserRow?.username != null
			)}
				<div>
					<dt>Username</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.username}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}

	{/snippet}
</EntityView>
