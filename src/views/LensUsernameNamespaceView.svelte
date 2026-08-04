<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensUsernameNamespace> = $props()

	const lensUsernameNamespace = $derived(selection({
		fields: {
			namespace: true,
			tokenName: true,
			tokenSymbol: true,
			totalUsernames: true,
			owner: true,
			createdAt: true,
			description: true,
		},
	}))
	const titleFallback = $derived([(prefetched.namespace ?? ''), (prefetched.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensUsernamesView from '$/views/LensUsernamesView.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsernameNamespace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]',
				{
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{[entity.namespace, (entity.tokenName ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{@const totalUsernames = entity.totalUsernames}
				{#if totalUsernames != null}
					<span data-text="muted">
						{totalUsernames}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lensUsernameNamespace}
		>
			{#snippet children(entity)}
				<dl data-column-item="center">
					{#if entity.tokenName != null}
						<div>
							<dt>Token name</dt>
							<dd>
								{entity.tokenName}
							</dd>
						</div>
					{/if}

					{#if entity.tokenSymbol != null}
						<div>
							<dt>Token symbol</dt>
							<dd>
								{entity.tokenSymbol}
							</dd>
						</div>
					{/if}

					{#if entity.totalUsernames != null}
						<div>
							<dt>Total usernames</dt>
							<dd>
								{entity.totalUsernames}
							</dd>
						</div>
					{/if}
				</dl>

				<dl data-column-item="center">
					<div>
						<dt>Address</dt>
						<dd>
							<TruncatedValue value={selection.entitySelector.address} />
						</dd>
					</div>

					{#if entity.owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={entity.owner} />
							</dd>
						</div>
					{/if}

					{#if entity.createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={entity.createdAt} />
							</dd>
						</div>
					{/if}
				</dl>

				{#if entity.description != null && entity.description !== ''}
					<p data-text="long-text">{entity.description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const usernamesResource = selection.$$usernames}
		<LensUsernamesView
			selection={usernamesResource}
			countResource={usernamesResource.count}
			title='Usernames'
			emptyText='No Lens usernames in this namespace.'
			id='usernames'
		/>
	{/snippet}
</EntityView>
