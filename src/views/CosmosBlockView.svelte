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
				label: 'network',
			},
			'height',
			'hash',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'height',
					'hash',
					{
						label: 'timestamp',
					},
				],
				[
					{
						label: 'proposer consensus address',
					},
					{
						label: 'transaction count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transactions',
					items: [
						{
							label: 'Cosmos transactions included in the block',
						},
					],
				},
				{
					label: 'Header',
					items: [
						'height',
						'hash',
						{
							label: 'proposer consensus address',
						},
						{
							label: 'time',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'height lookup',
						},
						{
							label: 'hash lookup only when source-backed',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Cosmos network',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosBlock>
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
	entityType={EntityType.CosmosBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
