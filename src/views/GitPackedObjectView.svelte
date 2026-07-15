<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.GitPackedObject>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.GitPackedObject>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const gitPackedObject = $derived(selection({
		fields: {
			storedKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || 'Git packed object')
	const viewDomId = $derived('git-packed-object-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitPackfileView from '$/views/GitPackfileView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitPackedObject}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitPackedObject}>
			{#snippet Pending()}
				{@const objectId0 = pendingEntity.objectId}
				{#if objectId0 !== undefined && objectId0 !== null}
					<TruncatedValue value={String((objectId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const objectId0 = resolvedEntity.objectId}
				{#if objectId0 !== undefined && objectId0 !== null}
					<TruncatedValue value={String((objectId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitPackedObject}>
			{#snippet Pending()}
				{[String((pendingEntity.storedKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || title || 'Git packed object'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.storedKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.objectId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitPackedObject}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$packfile}
				>
					{#snippet children(gitPackfile)}
						<span data-text="muted">
							<GitPackfileView
								selection={select(EntityType.GitPackfile, gitPackfile[EntityMetaKey.Selector])}
								prefetched={gitPackfile}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$packfile}
				>
					{#snippet children(gitPackfile)}
						<span data-text="muted">
							<GitPackfileView
								selection={select(EntityType.GitPackfile, gitPackfile[EntityMetaKey.Selector])}
								prefetched={gitPackfile}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>pack hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									packHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const packHash = pendingEntity.packHash}
							{#if packHash !== undefined && packHash !== null}
								<TruncatedValue value={String((packHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const packHash = resolvedEntity.packHash}
							{#if packHash !== undefined && packHash !== null}
								<TruncatedValue value={String((packHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectId = pendingEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectId = resolvedEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectFormat: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectFormat = pendingEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectFormat = resolvedEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							offset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const offset = pendingEntity.offset}
					{#if offset !== undefined && offset !== null}
						<div>
							<dt>offset</dt>
							<dd>
								<NumberValue value={Number(offset)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const offset = resolvedEntity.offset}
					{#if offset !== undefined && offset !== null}
						<div>
							<dt>offset</dt>
							<dd>
								<NumberValue value={Number(offset)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deltaBaseObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deltaBaseObjectId = pendingEntity.deltaBaseObjectId}
					{#if deltaBaseObjectId !== undefined && deltaBaseObjectId !== null}
						<div>
							<dt>delta base object ID</dt>
							<dd>
								{String((deltaBaseObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deltaBaseObjectId = resolvedEntity.deltaBaseObjectId}
					{#if deltaBaseObjectId !== undefined && deltaBaseObjectId !== null}
						<div>
							<dt>delta base object ID</dt>
							<dd>
								{String((deltaBaseObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storedKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storedKind = pendingEntity.storedKind}
					{#if storedKind !== undefined && storedKind !== null}
						<div>
							<dt>stored kind</dt>
							<dd>
								{String((storedKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storedKind = resolvedEntity.storedKind}
					{#if storedKind !== undefined && storedKind !== null}
						<div>
							<dt>stored kind</dt>
							<dd>
								{String((storedKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>packfile</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$packfile}
					>
						{#snippet children(gitPackfile)}
							{#if gitPackfile != null && gitPackfile[EntityMetaKey.Selector] != null}
								<GitPackfileView
									selection={select(EntityType.GitPackfile, gitPackfile[EntityMetaKey.Selector])}
									prefetched={gitPackfile}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$object}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(gitObject)}
					{#if gitObject != null && gitObject[EntityMetaKey.Selector] != null}
						<div>
							<dt>object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
