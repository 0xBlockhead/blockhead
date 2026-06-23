<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'sync committee period',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'sync committee period',
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
					label: 'Period',
					items: [
						{
							label: 'sync committee period',
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
							label: 'beacon sync committee endpoint payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSyncCommittee>
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
	entityType={EntityType.BeaconSyncCommittee}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
