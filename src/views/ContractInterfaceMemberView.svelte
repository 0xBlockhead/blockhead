<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ContractInterfaceMember> = $props()

	const contractInterfaceMember = $derived(selection({
		fields: {
			name: true,
			canonicalSignature: true,
			memberKind: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.canonicalSignature ?? ''), selection.entitySelector.memberKey].filter(Boolean).join(' ') || 'contract interface member')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ContractInterfaceMember}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={contractInterfaceMember}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.canonicalSignature ?? ''), selection.entitySelector.memberKey].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={contractInterfaceMember}>
			{#snippet children(entity)}
				{entity.memberKind || [(entity.name ?? ''), (entity.canonicalSignature ?? ''), selection.entitySelector.memberKey].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.interfaceId}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Interface ID</dt>
				<dd>
					{selection.entitySelector.interfaceId}
				</dd>
			</div>

			<div>
				<dt>Member key</dt>
				<dd>
					{selection.entitySelector.memberKey}
				</dd>
			</div>

			<div>
				<dt>Member kind</dt>
				<dd>
					<ResourceBoundary
						resource={contractInterfaceMember}
					>
						{#snippet children(entity)}
							{entity.memberKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={contractInterfaceMember}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={contractInterfaceMember}
			>
				{#snippet children(entity)}
					{@const canonicalSignature = entity.canonicalSignature}
					{#if canonicalSignature != null}
						<div>
							<dt>Canonical signature</dt>
							<dd>
								<TruncatedValue value={canonicalSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							selector: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selector = entity.selector}
					{#if selector != null}
						<div>
							<dt>Selector</dt>
							<dd>
								{selector}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateMutability: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateMutability = entity.stateMutability}
					{#if stateMutability != null}
						<div>
							<dt>State mutability</dt>
							<dd>
								{stateMutability}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
