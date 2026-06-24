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
			label: 'topic',
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
					label: 'topic',
				},
				{
					label: 'observation time',
				},
				'source',
				'memo',
				{
					label: 'admin key presence',
				},
				{
					label: 'submit key presence',
				},
				{
					label: 'auto-renew account/period',
				},
				{
					label: 'fee schedule key',
				},
				{
					label: 'exempt key count',
				},
				{
					label: 'custom fee summary',
				},
				{
					label: 'deleted flag',
				},
				{
					label: 'sequence number',
				},
				{
					label: 'running hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Topic',
				items: [
					{
						label: 'parent Hedera topic',
					},
				],
			},
			{
				label: 'Fee configuration',
				items: [
					{
						label: 'fee exempt keys',
					},
					{
						label: 'custom fees',
					},
				],
			},
			{
				label: 'Authorization',
				items: [
					{
						label: 'admin/submit keys',
					},
					{
						label: 'auto-renew account',
					},
				],
			},
			{
				label: 'Message cursor',
				items: [
					{
						label: 'latest sequence/running-hash evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw topic payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTopic_Timestamp>
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
	entityType={EntityType.HederaTopic_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
