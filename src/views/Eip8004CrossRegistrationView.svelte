<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Eip8004CrossRegistration>, 'prefetched'> = $props()

	const registrationFile = $derived(selection.entitySelector.$registrationFile)
	const titleFallback = $derived(selection.entitySelector.targetKind || 'EIP-8004 cross registration')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004CrossRegistration}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]/(eip8004AgentRegistrationFile)/cross-registration/[targetKind=stringSegment]/[targetSelectorHashAlgorithm=stringSegment]/[targetSelectorHash=zeroExHex]',
				{
					namespace: registrationFile.$registration.namespace,
					chainId: String(registrationFile.$registration.chainId),
					identityRegistry: registrationFile.$registration.identityRegistry,
					agentId: registrationFile.$registration.agentId,
					fileUrl: encodeURIComponent(registrationFile.fileUrl),
					targetKind: selection.entitySelector.targetKind,
					targetSelectorHashAlgorithm: selection.entitySelector.targetSelectorHashAlgorithm,
					targetSelectorHash: selection.entitySelector.targetSelectorHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.targetSelectorHash || selection.entitySelector.targetKind || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.targetSelectorHashAlgorithm}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Registration file</dt>
				<dd>
					<Eip8004AgentRegistrationFileView
						selection={select(EntityType.Eip8004AgentRegistrationFile, selection.entitySelector.$registrationFile)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Target kind</dt>
				<dd>
					{selection.entitySelector.targetKind}
				</dd>
			</div>

			<div>
				<dt>Target selector hash algorithm</dt>
				<dd>
					{selection.entitySelector.targetSelectorHashAlgorithm}
				</dd>
			</div>

			<div>
				<dt>Target selector hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.targetSelectorHash} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.Eip8004Scan_Rest,
						],
					})({
						fields: {
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceUri = entity.evidenceUri}
					{#if evidenceUri != null}
						<div>
							<dt>Evidence URI</dt>
							<dd>
								<a
									href={evidenceUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={evidenceUri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
