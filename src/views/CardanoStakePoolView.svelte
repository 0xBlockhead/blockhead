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
			label: 'pool id',
		},
		{
			label: 'VRF key hash',
		},
		{
			label: 'latest pledge',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'pool id',
				},
				{
					label: 'VRF key hash',
				},
				{
					label: 'latest pledge',
				},
				{
					label: 'latest margin',
				},
				{
					label: 'latest stake/delegator snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped stake-pool economics/stake observations',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'pool metadata from latest registration/update snapshot',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'produced blocks when indexing exists',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakePool>
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
	entityType={EntityType.CardanoStakePool}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
