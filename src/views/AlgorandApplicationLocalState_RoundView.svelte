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
		'$account',
		'$application',
		'round',
	],
	content: {
		dl: [
			[
				'$account',
				'$application',
				'round',
				'source',
				'schema',
				'deleted',
				{
					label: 'key-value state summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Algorand account',
					},
				],
			},
			{
				label: 'Application',
				items: [
					'$application',
				],
			},
			{
				label: 'Key/value state',
				items: [
					{
						label: 'decoded',
					},
					{
						label: 'raw state JSON',
					},
				],
			},
			{
				label: 'Round context',
				items: [
					{
						label: 'ledger round coordinate',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account application local-state payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandApplicationLocalState_Round>
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
	entityType={EntityType.AlgorandApplicationLocalState_Round}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
