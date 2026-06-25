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
		'$subnet',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$subnet',
				'timestampMs',
				'source',
				'validatorCount',
				'delegatorCount',
			],
			[
				'totalStakeNavax',
				'chainCount',
				'pendingValidatorCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subnet',
				items: [
					'$subnet',
				],
			},
			{
				label: 'Validators',
				items: [
					{
						label: 'validator rows for the observation when sourceable',
					},
				],
			},
			{
				label: 'Delegators',
				items: [
					{
						label: 'delegator rows for the observation when sourceable',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'freshness',
					},
					{
						label: 'raw validator-set payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheSubnet_Timestamp>
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
	entityType={EntityType.AvalancheSubnet_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
