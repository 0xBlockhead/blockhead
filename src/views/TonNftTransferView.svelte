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
				label: 'transfer id',
			},
			'source',
			{
				label: 'item',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transfer id',
					},
					'source',
					{
						label: 'item',
					},
					{
						label: 'collection',
					},
					{
						label: 'from account',
					},
					{
						label: 'to account',
					},
					{
						label: 'transaction lt/hash',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'query id',
					},
					{
						label: 'forward amount',
					},
					{
						label: 'response destination',
					},
					{
						label: 'trace/message refs',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Item',
					items: [
						{
							label: 'transferred item identity',
						},
					],
				},
				{
					label: 'Collection',
					items: [
						{
							label: 'collection identity',
						},
					],
				},
				{
					label: 'From/To',
					items: [
						{
							label: 'sender and recipient accounts',
						},
					],
				},
				{
					label: 'Trace',
					items: [
						{
							label: 'containing trace graph',
						},
					],
				},
				{
					label: 'Message',
					items: [
						{
							label: 'underlying message edge',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'custom/forward payload evidence',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'NFT transfer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftTransfer>
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
	entityType={EntityType.TonNftTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
