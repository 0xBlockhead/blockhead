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
			label: 'validator',
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
					label: 'validator',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'jailed state',
				},
				'status',
				'tokens',
				{
					label: 'delegator shares',
				},
				{
					label: 'commission rate',
				},
				{
					label: 'minimum self-delegation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator',
				items: [
					{
						label: 'parent Cosmos validator',
					},
				],
			},
			{
				label: 'Delegations',
				items: [
					{
						label: 'delegations to this validator',
					},
				],
			},
			{
				label: 'Consensus set',
				items: [
					{
						label: 'CometBFT validator-set evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'staking/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator_Timestamp>
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
	entityType={EntityType.CosmosValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
