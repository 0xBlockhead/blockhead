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
		'$token',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$token',
				'timestampMs',
				'source',
				'blockHeight',
				'name',
				'symbol',
				'decimals',
			],
			[
				'totalSupply',
				'holderCount',
				'transferCount',
				{
					label: 'contract verification flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Token',
				items: [
					{
						label: 'parent token identity',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					'name',
					'symbol',
					'decimals',
				],
			},
			{
				label: 'Metrics',
				items: [
					{
						label: 'supply',
					},
					'holderCount',
					'transferCount',
					{
						label: 'verification flag',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract identity when contract-backed',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'token overview/indexer payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronToken_Timestamp>
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
	entityType={EntityType.TronToken_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
