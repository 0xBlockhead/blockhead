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
				label: 'the finalized Beacon epoch',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'the finalized Beacon epoch',
					},
				],
				[
					{
						label: 'as-of timestamp',
					},
					{
						label: 'current justified Beacon epoch/root',
					},
					{
						label: 'finalized Beacon epoch/root',
					},
					{
						label: 'previous justified Beacon epoch/root',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent EVM/Beacon network',
						},
					],
				},
				{
					label: 'Checkpoints',
					items: [
						{
							label: 'current/previous justified checkpoint roots',
						},
						{
							label: 'finalized checkpoint root',
						},
					],
				},
				{
					label: 'Epochs',
					items: [
						{
							label: 'checkpoint Beacon epochs when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Beacon REST finality checkpoint payload',
						},
						{
							label: 'endpoint freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
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
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
