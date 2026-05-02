<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href: hrefProp,
		title: titleProp,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: BeaconEpochId
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
		>
	> = $props()


	const href = $derived(
		hrefProp ?? (
			resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
				{
					networkId: String(entityId.$network.chainId),
					epochNumber: String(entityId.epoch),
				},
			)
		),
	)

	const title = $derived(
		titleProp ?? `Epoch ${entityId.epoch.toLocaleString()}`,
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	{title}
	{href}
	{open}
	layout={EntityLayout.Summary}
	{...entityViewRest}
/>
