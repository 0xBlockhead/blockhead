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
			label: 'timestamp',
		},
		'source',
		{
			label: 'absolute slot',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'absolute slot',
				},
				{
					label: 'block height',
				},
				'epoch',
				{
					label: 'slot index',
				},
				{
					label: 'slots in epoch',
				},
			],
			[
				{
					label: 'transaction count',
				},
				{
					label: 'current/delinquent validator counts',
				},
				{
					label: 'activated stake',
				},
				{
					label: 'core version',
				},
				{
					label: 'feature set',
				},
				'health',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Slot/epoch',
				items: [
					{
						label: 'slot',
					},
					{
						label: 'epoch progress',
					},
				],
			},
			{
				label: 'Validators/stake',
				items: [
					{
						label: 'current/delinquent counts',
					},
					{
						label: 'activated stake',
					},
				],
			},
			{
				label: 'Node/version',
				items: [
					'health',
					{
						label: 'core version',
					},
					{
						label: 'feature set',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getEpochInfo',
					},
					{
						label: 'getHealth',
					},
					{
						label: 'getVersion',
					},
					{
						label: 'getVoteAccounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork_Timestamp>
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
	entityType={EntityType.SolanaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
