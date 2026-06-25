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
		'$accountState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$accountState',
				'timestampMs',
				'source',
				'balance',
				{
					label: 'balance observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account state',
				items: [
					{
						label: 'parent local account state',
					},
				],
			},
			{
				label: 'Public account',
				items: [
					{
						label: 'public Quilibrium account when resolved',
					},
				],
			},
			{
				label: 'Connected node',
				items: [
					{
						label: 'parent Quilibrium node state',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'decryptable balanceAccount response',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumAccountState_Timestamp>
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
	entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
