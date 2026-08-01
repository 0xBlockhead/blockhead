<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Eip8004AgentRegistrationFile> = $props()


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentRegistrationFile}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.fileUrl || 'EIP-8004 agent registration file')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<Eip8004AgentRegistrationView
			selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
