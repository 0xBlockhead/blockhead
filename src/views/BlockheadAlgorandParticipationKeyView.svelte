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
				label: 'node id',
			},
			{
				label: 'participation id',
			},
			{
				label: 'account',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'node id',
					},
					{
						label: 'participation id',
					},
					{
						label: 'account',
					},
					{
						label: 'network',
					},
					{
						label: 'validity round range',
					},
					{
						label: 'key dilution',
					},
					{
						label: 'effective round range',
					},
					{
						label: 'last synced time',
					},
					{
						label: 'connected-node status',
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
							label: 'linked Algorand account',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'linked Algorand network',
						},
					],
				},
				{
					label: 'Validity',
					items: [
						{
							label: 'first/last/effective rounds',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAlgorandParticipationKey>
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
	entityType={EntityType.BlockheadAlgorandParticipationKey}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
