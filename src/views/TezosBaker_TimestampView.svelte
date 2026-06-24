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
			label: 'baker',
		},
		'level',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'baker',
				},
				'level',
				'source',
				{
					label: 'consensus key',
				},
				{
					label: 'staking balance',
				},
				{
					label: 'delegated balance',
				},
				{
					label: 'own delegated balance',
				},
				{
					label: 'voting power',
				},
				{
					label: 'active status',
				},
				{
					label: 'timestamp',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Baker',
				items: [
					{
						label: 'parent Tezos baker',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'underlying Tezos account',
					},
				],
			},
			{
				label: 'Stake',
				items: [
					{
						label: 'staking/delegated/voting-power values',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'delegate/account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBaker_Timestamp>
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
	entityType={EntityType.TezosBaker_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
