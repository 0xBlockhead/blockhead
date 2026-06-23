<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		lists: [
			{
				id: 'committee-validators',
				label: 'Committee validators',
				limit: 16,
				query: {
					sources: [
						'Beacon_Rest',
					],
					limit: 16,
				},
				item: 'summary',
			},
		],
		closed: [
			{
				label: 'committee index in the slot',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'committee index in the slot',
					},
				],
				[
					{
						label: 'validator count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Slot',
					items: [
						{
							label: 'slot assignment context',
						},
					],
				},
				{
					label: 'Validators',
					items: [
						{
							label: 'validator index list',
						},
						{
							label: 'validator count',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'beacon committee endpoint payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconCommittee>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BeaconCommittee}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
