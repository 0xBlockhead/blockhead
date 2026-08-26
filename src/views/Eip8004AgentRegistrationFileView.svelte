<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Eip8004AgentRegistrationFile>, 'prefetched'> = $props()

	const registration = $derived(selection.entitySelector.$registration)


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentRegistrationFile}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.fileUrl || 'EIP-8004 agent registration file')}
	href={
		href === undefined ?
			resolve(
				'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]',
				{
					namespace: registration.namespace,
					chainId: String(registration.chainId),
					identityRegistry: registration.identityRegistry,
					agentId: registration.agentId,
					fileUrl: encodeURIComponent(selection.entitySelector.fileUrl),
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
		<Eip8004AgentRegistrationView
			selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Registration</dt>
				<dd>
					<Eip8004AgentRegistrationView
						selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>File URL</dt>
				<dd>
					<a
						href={selection.entitySelector.fileUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.fileUrl} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
