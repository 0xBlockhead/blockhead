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
		'assetId',
		{
			label: 'ticker/name',
		},
		'precision',
	],
	content: {
		dl: [
			[
				'assetId',
				{
					label: 'ticker/name',
				},
				'precision',
				'entityDomain',
				{
					label: 'blinded issuance flag',
				},
				{
					label: 'latest issued/burned totals',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Supply snapshots',
				items: [
					{
						label: 'timestamped issued/burned total observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Elements network',
					},
				],
			},
			{
				label: 'Issuances',
				items: [
					{
						label: 'Elements issuance rows',
					},
				],
			},
			{
				label: 'Registry contract',
				items: [
					{
						label: 'contractJson/source metadata',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'issuances',
			label: 'issuances',
			field: '$$issuances',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ElementsAsset>
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
	entityType={EntityType.ElementsAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
