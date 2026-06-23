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
				label: 'asset',
			},
			{
				label: 'timestamp',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'asset',
					},
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'block number/hash',
					},
					'supply',
					{
						label: 'holder count',
					},
					'status',
					{
						label: 'metadata',
					},
					{
						label: 'existential deposit',
					},
					{
						label: 'role accounts',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Asset',
					items: [
						{
							label: 'parent Polkadot asset',
						},
					],
				},
				{
					label: 'Role accounts',
					items: [
						{
							label: 'Polkadot account refs when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'runtime storage/indexer asset payload',
						},
					],
				},
				{
					label: 'Balances',
					items: [
						{
							label: 'account-balance observations at the same source/block when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAsset_Timestamp>
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
	entityType={EntityType.PolkadotAsset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
