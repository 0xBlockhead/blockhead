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
		{
			label: 'tx id',
		},
		{
			label: 'block',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'tx id',
				},
				{
					label: 'block',
				},
				'version',
				{
					label: 'fee',
				},
				{
					label: 'size/vsize/weight',
				},
				{
					label: 'lock time',
				},
				{
					label: 'coinbase flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Inputs',
				items: [
					{
						label: 'transaction inputs',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'transaction outputs',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing block when confirmed',
					},
				],
			},
			{
				label: 'Shielded actions',
				items: [
					{
						label: 'Zcash shielded actions when present',
					},
				],
			},
			{
				label: 'Raw/source',
				items: [
					{
						label: 'source payload fields useful for debugging resolver conflicts',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoTransaction>
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
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
