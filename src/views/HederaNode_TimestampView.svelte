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
		'$node',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$node',
				'timestampMs',
				'source',
				'$node',
				'description',
			],
			[
				'fileId',
				'memo',
				'publicKey',
				{
					label: 'certificate hash',
				},
				{
					label: 'endpoint count',
				},
			],
			[
				'stakeTinybar',
				{
					label: 'rewarded stake',
				},
				{
					label: 'not-rewarded stake',
				},
				{
					label: 'min/max stake',
				},
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent Hedera node',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'node Hedera account',
					},
				],
			},
			{
				label: 'Endpoints',
				items: [
					{
						label: 'service endpoint list',
					},
				],
			},
			{
				label: 'Stake',
				items: [
					'stakeTinybar',
					{
						label: 'reward split fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registered-node/address-book/stake payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNode_Timestamp>
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
	entityType={EntityType.HederaNode_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
