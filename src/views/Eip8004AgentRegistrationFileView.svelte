<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Eip8004AgentRegistrationFile>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Eip8004AgentRegistrationFile>
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
	const eip8004AgentRegistrationFile = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.fileUrl) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 agent registration file')
	const viewDomId = $derived('eip8004agent-registration-file-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentRegistrationFile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$registration') && prefetched.$registration != null}
			{[String((pendingEntity.fileUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={eip8004AgentRegistrationFile}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.fileUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$registration') && prefetched.$registration != null}
			{@const eip8004AgentRegistration0 = pendingEntity.$registration}
			{#if eip8004AgentRegistration0 != null && selection.entitySelector.$registration != null}
				<Eip8004AgentRegistrationView
					selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration, { sources: selection.sources })}
					prefetched={eip8004AgentRegistration0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={eip8004AgentRegistrationFile}>
				{#snippet children(entity)}
					<Eip8004AgentRegistrationView
						selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Registration</dt>
				<dd>
					<Eip8004AgentRegistrationView
						selection={select(EntityType.Eip8004AgentRegistration, selection.entitySelector.$registration)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>File URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									fileUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fileUrl = resolvedEntity.fileUrl}
							{#if fileUrl !== undefined && fileUrl !== null}
								<svelte:element
									this={'a'}
									href={String(fileUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(fileUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
