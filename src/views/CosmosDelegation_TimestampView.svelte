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
			label: 'delegation',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'delegation',
				},
				{
					label: 'observation time',
				},
				'source',
				'shares',
				{
					label: 'delegated balance',
				},
				{
					label: 'reward amount when sourced',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delegation',
				items: [
					{
						label: 'parent Cosmos delegation',
					},
				],
			},
			{
				label: 'Delegator',
				items: [
					{
						label: 'delegator Cosmos account',
					},
				],
			},
			{
				label: 'Validator',
				items: [
					{
						label: 'validator receiving delegated stake',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'staking/distribution payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosDelegation_Timestamp>
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
	entityType={EntityType.CosmosDelegation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
