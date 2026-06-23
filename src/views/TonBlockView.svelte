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
			'workchain',
			{
				label: 'shard prefix',
			},
			'seqno',
		],
		content: {
			dl: [
				[
					'workchain',
					{
						label: 'shard prefix',
					},
					'seqno',
					{
						label: 'root hash',
					},
					{
						label: 'file hash',
					},
					{
						label: 'generated time',
					},
					{
						label: 'logical-time range',
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
							label: 'transactions in this block',
						},
					],
				},
				{
					label: 'Messages',
					items: [
						{
							label: 'messages in this block',
						},
					],
				},
				{
					label: 'Workchain',
					items: [
						{
							label: 'parent TON workchain',
						},
					],
				},
				{
					label: 'Neighboring shards',
					items: [
						{
							label: 'timestamped shard observations',
						},
					],
				},
				{
					label: 'Proof/cell evidence',
					items: [
						{
							label: 'raw block id',
						},
						{
							label: 'proof payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonBlock>
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
	entityType={EntityType.TonBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
