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
		'$assetInstance',
		'$account',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'$account',
				'timestampMs',
				'source',
				'ledgerCoordinateKind',
				{
					label: 'can-hold/can-send/can-receive flags',
				},
				'reasons',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					'$assetInstance',
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'subject account',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'source payload',
					},
					{
						label: 'simulated transfer/restriction call result',
					},
					{
						label: 'ledger coordinate when source-bound',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetEligibility>
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
	entityType={EntityType.AssetEligibility}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
