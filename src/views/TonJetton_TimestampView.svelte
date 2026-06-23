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
				label: 'jetton',
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
						label: 'jetton',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'admin address',
					},
					{
						label: 'code/data hashes',
					},
					{
						label: 'wallet code hash',
					},
					'name',
					'symbol',
					'decimals',
					{
						label: 'total supply',
					},
					{
						label: 'mintable flag',
					},
					{
						label: 'holder count',
					},
					'verification',
					{
						label: 'last transaction lt',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Jetton',
					items: [
						{
							label: 'parent jetton identity',
						},
					],
				},
				{
					label: 'Metadata',
					items: [
						{
							label: 'description/image/metadata URI',
						},
						{
							label: 'normalized fields',
						},
					],
				},
				{
					label: 'Supply/admin',
					items: [
						{
							label: 'total supply',
						},
						{
							label: 'mintability',
						},
						{
							label: 'admin',
						},
						{
							label: 'holder count',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw jetton master/get-method/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonJetton_Timestamp>
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
	entityType={EntityType.TonJetton_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
