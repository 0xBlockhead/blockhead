<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
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
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
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
			verifications: {},
			custody: {},
			authMethod: {},
			signedAt: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading account…"
		>
			{#snippet children(account)}
				<HeadingComponent>
					{account.displayName ?? account.username ?? String(entityId.fid)}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading account…"
		>
			{#snippet children(account)}
				{#if (
					account.username !== undefined
					&& account.username !== (
						account.displayName ?? account.username ?? String(entityId.fid)
					)
				)}
					<span data-text="muted">
						@{account.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading account…"
		>
			{#snippet children(account)}
				{#if account.bio}
					<p data-text="muted">
						{account.bio}
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				{entityId}
			>
				<ResourceBoundary
					resource={connection}
					placeholderText="Loading account…"
				>
					{#snippet children(account)}
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(entityId.fid)}</dd>
							</div>
							{#if account.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{account.displayName}</dd>
								</div>
							{/if}
							{#if account.username}
								<div>
									<dt>Username</dt>
									<dd>{account.username}</dd>
								</div>
							{/if}
							{#if account.$icon}
								{#if account.$icon[EntityMetaKey.Id].url}
									<div>
										<dt>Profile image</dt>
										<dd data-column>
											<Media
												media={{ url: account.$icon[EntityMetaKey.Id].url }}
												alt={(account.displayName ?? account.username) ?? ''}
											/>
											<a href={account.$icon[EntityMetaKey.Id].url}>{account.$icon[EntityMetaKey.Id].url}</a>
										</dd>
									</div>
								{/if}
							{/if}
							{#if account.bio}
								<div>
									<dt>Bio</dt>
									<dd>{account.bio}</dd>
								</div>
							{/if}
							{#if account.authMethod}
								<div>
									<dt>Auth method</dt>
									<dd>{account.authMethod}</dd>
								</div>
							{/if}
							{#if account.custody}
								<div>
									<dt>Custody</dt>
									<dd>{account.custody}</dd>
								</div>
							{/if}
							{#if account.verifications && account.verifications.length}
								<div>
									<dt>Verifications</dt>
									<dd>{account.verifications.join(', ')}</dd>
								</div>
							{/if}
							{#if account.signedAt !== undefined}
								<div>
									<dt>Signed at</dt>
									<dd>{new Date(account.signedAt).toISOString()}</dd>
								</div>
							{/if}
						</dl>
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
