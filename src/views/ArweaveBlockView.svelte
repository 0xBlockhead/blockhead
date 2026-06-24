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
		'height',
		{
			label: 'indep hash',
		},
		{
			label: 'timestamp',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'height',
				{
					label: 'indep hash',
				},
				{
					label: 'previous block',
				},
				{
					label: 'timestamp',
				},
				{
					label: 'transaction count',
				},
			],
			[
				{
					label: 'reward address',
				},
				{
					label: 'reward pool',
				},
				{
					label: 'weave size',
				},
				{
					label: 'block size',
				},
				{
					label: 'cumulative difficulty',
				},
				{
					label: 'hash-list merkle',
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
						label: 'transactions included in this block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Arweave network',
					},
				],
			},
			{
				label: 'Block header',
				items: [
					{
						label: 'transaction root',
					},
					{
						label: 'wallet list',
					},
					{
						label: 'reward address',
					},
					{
						label: 'reward pool',
					},
					{
						label: 'weave size',
					},
					{
						label: 'block size',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'GraphQL id lookup',
					},
					{
						label: 'GraphQL height/range page',
					},
					{
						label: 'gateway/node block endpoint',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'confirmation/deep-history availability',
					},
					{
						label: 'gateway archival behavior',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveBlock>
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
	entityType={EntityType.ArweaveBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
