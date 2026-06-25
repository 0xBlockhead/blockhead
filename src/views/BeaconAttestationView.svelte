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
			label: 'attestation index in the slot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'attestation index in the slot',
				},
			],
			[
				'committeeIndex',
				{
					label: 'truncated aggregation bits',
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
						label: 'Beacon slot/block body context',
					},
				],
			},
			{
				label: 'Committee',
				items: [
					'committeeIndex',
					'aggregationBits',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'beacon block/body attestation payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconAttestation>
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
	entityType={EntityType.BeaconAttestation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
